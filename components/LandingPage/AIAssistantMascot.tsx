import React, { useEffect, useRef, useState } from "react";
import type { LiveServerMessage } from "@google/genai";

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) int16[i] = Math.max(-1, Math.min(1, data[i])) * 32768;
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: "audio/pcm;rate=16000",
  };
}

type Props = {
  idleSrc?: string;
  listeningSrc?: string;
  speakingSrc?: string;
};

export default function AIAssistantMascot({ idleSrc, listeningSrc, speakingSrc }: Props) {
  const base = (import.meta as any).env?.BASE_URL || "/";

  const IDLE_IMG = idleSrc || `${base}images/assistant-sofa.webp`;
  const LISTENING_IMG = listeningSrc || `${base}images/assistant-listening.webp`;
  const SPEAKING_IMG = speakingSrc || `${base}images/assistant-speaking.webp`;

  const [isConnecting, setIsConnecting] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);

  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const speakingUntilRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  const disconnectVoice = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (inputContextRef.current) {
      inputContextRef.current.close();
      inputContextRef.current = null;
    }
    if (outputContextRef.current) {
      outputContextRef.current.close();
      outputContextRef.current = null;
    }

    sourcesRef.current.forEach((s) => s.stop());
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
    speakingUntilRef.current = 0;

    setIsVoiceActive(false);
    setIsConnecting(false);
    setIsAgentSpeaking(false);
  };

  const startSpeakingWatcher = () => {
    const tick = () => {
      const ctx = outputContextRef.current;
      if (!ctx) return;

      const now = ctx.currentTime;
      setIsAgentSpeaking(now < speakingUntilRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  };

  const connectVoice = async () => {
    try {
      setError(null);
      setIsConnecting(true);

      const apiKey =
        (process as any).env?.API_KEY ||
        (process as any).env?.GEMINI_API_KEY ||
        "";

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });

      inputContextRef.current = inputCtx;
      outputContextRef.current = outputCtx;

      const outputGain = outputCtx.createGain();
      outputGain.connect(outputCtx.destination);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      startSpeakingWatcher();

      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-12-2025",
        config: {
          responseModalities: ["AUDIO" as any],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } },
          },
          systemInstruction:
            "You are IVS-1, an AI admission advisor for Iqra Virtual School. Keep answers short and helpful. Guide parents through trial booking and registration.",
        },
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsVoiceActive(true);

            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);

            sourceRef.current = source;
            processorRef.current = processor;
          },
          onmessage: async (msg: LiveServerMessage) => {
            const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;

            if (base64Audio) {
              const ctx = outputContextRef.current;
              if (!ctx) return;

              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);

              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);

              source.addEventListener("ended", () => {
                sourcesRef.current.delete(source);
              });

              source.start(nextStartTimeRef.current);
              sourcesRef.current.add(source);

              const endTime = nextStartTimeRef.current + audioBuffer.duration;
              speakingUntilRef.current = Math.max(speakingUntilRef.current, endTime);
              nextStartTimeRef.current = endTime;
            }

            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach((s) => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              speakingUntilRef.current = 0;
              setIsAgentSpeaking(false);
            }
          },
          onclose: () => disconnectVoice(),
          onerror: () => {
            setError("Connection failed. Please try again.");
            disconnectVoice();
          },
        },
      });

      void sessionPromise;
    } catch {
      setError("Mic permission or connection failed.");
      setIsConnecting(false);
      setIsVoiceActive(false);
    }
  };

  const toggle = () => {
    if (isConnecting) return;
    if (isVoiceActive) disconnectVoice();
    else connectVoice();
  };

  useEffect(() => {
    return () => disconnectVoice();
  }, []);

  const mode: "idle" | "connecting" | "listening" | "speaking" = isConnecting
    ? "connecting"
    : !isVoiceActive
    ? "idle"
    : isAgentSpeaking
    ? "speaking"
    : "listening";

  const desiredImg =
    mode === "idle" ? IDLE_IMG : mode === "speaking" ? SPEAKING_IMG : LISTENING_IMG;

  const [currentImg, setCurrentImg] = useState(desiredImg);
  useEffect(() => setCurrentImg(desiredImg), [desiredImg]);

  const laptopWord =
    mode === "idle"
      ? "READY"
      : mode === "connecting"
      ? "CONNECTING"
      : mode === "speaking"
      ? "SPEAKING"
      : "LISTENING";

  const ariaLabel = mode === "idle" ? "Start voice assistant" : "Stop voice assistant";

  return (
    <>
      <div className="ivs-assistant-wrap" aria-label="IVS Voice Assistant">
        <div
          className="ivs-assistant-card"
          role="button"
          tabIndex={0}
          onClick={toggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggle();
          }}
          aria-label={ariaLabel}
        >
          <button
            type="button"
            className="ivs-hotspot"
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            aria-label={ariaLabel}
          >
            <span className={`ivs-dot ${mode !== "idle" ? "on" : ""}`} />
            <span className="ivs-laptop-word">{laptopWord}</span>
          </button>

          <img
            src={currentImg}
            alt="IVS AI Assistant"
            className="ivs-assistant-img"
            width={512}
            height={501}
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => {
              if (desiredImg === SPEAKING_IMG) setCurrentImg(LISTENING_IMG);
              else setError("Assistant image not found. Check file name/path.");
            }}
          />
        </div>

        {error && <div className="ivs-err">{error}</div>}
      </div>

      <style>{`
        .ivs-assistant-wrap{
          position: fixed;
          right: 8px;
          bottom: 8px;
          z-index: 99999;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .ivs-assistant-card{
          pointer-events: auto;
          position: relative;
          width: clamp(88px, 7vw, 118px);
          max-width: 118px;
          cursor: pointer;
          user-select: none;
          touch-action: manipulation;
          filter: drop-shadow(0 8px 18px rgba(0,0,0,0.10));
        }

        .ivs-assistant-img{
          width: 100%;
          height: auto;
          max-height: 18vh;
          object-fit: contain;
          object-position: bottom right;
          display: block;
        }

        .ivs-hotspot{
          pointer-events: auto;
          position: absolute;
          left: 61%;
          top: -14%;
          transform: translate(-50%, 0);
          background: transparent;
          border: none;
          padding: 2px 4px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          z-index: 2;
        }

        .ivs-dot{
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(148,163,184,0.9);
          box-shadow: 0 0 0 3px rgba(148,163,184,0.12);
          flex-shrink: 0;
        }

        .ivs-dot.on{
          background: rgba(16,185,129,1);
          box-shadow: 0 0 0 4px rgba(16,185,129,0.14);
        }

        .ivs-laptop-word{
          font-family: Orbitron, Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          font-weight: 800;
          letter-spacing: 0.14em;
          font-size: 7px;
          color: rgba(30, 41, 59, 0.34);
          text-transform: uppercase;
          white-space: nowrap;
        }

        .ivs-err{
          margin-top: 8px;
          pointer-events: auto;
          max-width: 200px;
          background: rgba(239,68,68,0.10);
          border: 1px solid rgba(239,68,68,0.30);
          color: rgba(220,38,38,1);
          border-radius: 12px;
          padding: 8px 10px;
          font-size: 10px;
          font-weight: 700;
        }

        @media (max-width: 768px){
          .ivs-assistant-card{
            width: 84px;
            max-width: 84px;
          }

          .ivs-assistant-img{
            max-height: 15vh;
          }

          .ivs-hotspot{
            left: 56%;
            top: 2%;
          }

          .ivs-laptop-word{
            font-size: 6px;
          }
        }
      `}</style>
    </>
  );
}
