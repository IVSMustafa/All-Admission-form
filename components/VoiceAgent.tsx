import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, X, Loader2, Sparkles, Hand } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import type { LiveServerMessage } from '@google/genai';

// --- HELPERS (Encode/Decode) ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
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
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// --- AVATAR COMPONENTS ---

const HumanAvatarIdle = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>
      <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="1" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Shoulders/Body */}
    <path d="M20 90 Q50 100 80 90 L80 100 L20 100 Z" fill="url(#avatarGradient)" opacity="0.5" />
    <path d="M25 85 C25 85 30 65 50 65 C70 65 75 85 75 85" stroke="url(#avatarGradient)" strokeWidth="2" fill="none" filter="url(#glow)"/>

    {/* Neck */}
    <rect x="42" y="55" width="16" height="15" fill="url(#avatarGradient)" opacity="0.6" />

    {/* Head shape */}
    <path d="M35 30 C35 10 65 10 65 30 C65 45 60 58 50 58 C40 58 35 45 35 30" fill="url(#avatarGradient)" filter="url(#glow)" />
    
    {/* Interface Details */}
    <circle cx="40" cy="30" r="2" fill="white" fillOpacity="0.9" />
    <circle cx="60" cy="30" r="2" fill="white" fillOpacity="0.9" />
    <path d="M45 45 Q50 48 55 45" stroke="white" strokeWidth="1.5" fill="none" strokeOpacity="0.8" />
    
    {/* Holographic lines */}
    <path d="M30 30 L70 30" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
    <path d="M30 40 L70 40" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
    <path d="M30 50 L70 50" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
  </svg>
);

const HolographicAvatarActive = ({ isSpeaking, volume }: { isSpeaking: boolean, volume: number }) => {
  // Map volume (0-255) to mouth height (2px - 20px)
  const mouthHeight = Math.max(2, Math.min(20, volume / 5));
  
  return (
    <div className="relative w-28 h-28 sm:w-40 sm:h-40 flex items-center justify-center my-3 sm:my-4">
      {/* Outer Rotating Rings */}
      <div className="absolute inset-0 border border-brand-orange/20 rounded-full animate-[spin_8s_linear_infinite]"></div>
      <div className="absolute inset-4 border border-brand-orange/10 rounded-full animate-[spin_12s_linear_infinite_reverse]"></div>
      
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-brand-orange/10 rounded-full blur-2xl transition-opacity duration-300 ${isSpeaking ? 'opacity-100' : 'opacity-30'}`}></div>

      {/* Head Container */}
     <div className="relative z-10 w-20 h-20 sm:w-28 sm:h-28 bg-brand-cream/90 border border-brand-orange/40 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col items-center justify-center shadow-[0_0_24px_rgba(34,211,238,0.16)] backdrop-blur-xl overflow-hidden">
        
        {/* Holographic Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:100%_4px] opacity-30 pointer-events-none"></div>

        {/* Eyes */}
        <div className="flex gap-4 sm:gap-6 mb-3 sm:mb-4">
          <div className="relative">
            <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-brand-orange shadow-[0_0_10px_#22d3ee] transition-transform duration-100 ${isSpeaking ? 'scale-110' : 'scale-100'}`}></div>
            <div className="absolute top-0 left-0 w-3 h-3 bg-white blur-[2px] opacity-50"></div>
          </div>
          <div className="relative">
            <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-brand-orange shadow-[0_0_10px_#22d3ee] transition-transform duration-100 ${isSpeaking ? 'scale-110' : 'scale-100'}`}></div>
            <div className="absolute top-0 left-0 w-3 h-3 bg-white blur-[2px] opacity-50"></div>
          </div>
        </div>

        {/* Mouth (Dynamic) */}
        <div className="h-6 flex items-center justify-center">
           <div 
             className="w-8 sm:w-10 bg-brand-orange/90 rounded-full shadow-[0_0_10px_#22d3ee] transition-all duration-75 ease-linear"
             style={{ height: `${mouthHeight}px` }}
           ></div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN AGENT COMPONENT ---
interface VoiceAgentProps {
  variant?: 'sidebar' | 'floating';
}

const VoiceAgent = ({ variant = 'floating' }: VoiceAgentProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Audio Analysis State
  const [volume, setVolume] = useState(0);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);

  // References for Audio & Session
  const sessionRef = useRef<any>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const disconnect = () => {
    // Stop Animation Loop
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Cleanup input
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (inputContextRef.current) {
      inputContextRef.current.close();
      inputContextRef.current = null;
    }

    // Cleanup output
    if (outputContextRef.current) {
      outputContextRef.current.close();
      outputContextRef.current = null;
    }
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;

    // Cleanup session
    if (sessionRef.current) {
      sessionRef.current = null;
    }

    setIsActive(false);
    setIsConnecting(false);
    setVolume(0);
    setIsAgentSpeaking(false);
  };

  const connect = async () => {
    try {
      setError(null);
      setIsConnecting(true);

      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      
      // Initialize Audio Contexts
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      // Setup Analyser for Mouth Animation
      const analyser = outputCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const outputNode = outputCtx.createGain();
      outputNode.connect(analyser); // Connect to analyser first
      analyser.connect(outputCtx.destination); // Then to speakers
      
      inputContextRef.current = inputCtx;
      outputContextRef.current = outputCtx;

      // Start Microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Start Animation Loop for Volume Visualization
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateVolume = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          // Calculate average volume of relevant frequencies (skip very low/high)
          let sum = 0;
          const relevantBins = Math.floor(bufferLength / 2); // Use lower half
          for (let i = 0; i < relevantBins; i++) {
            sum += dataArray[i];
          }
          const avg = sum / relevantBins;
          setVolume(avg);
          
          // Heuristic for "Is Speaking" based on volume threshold
          setIsAgentSpeaking(avg > 10);
        }
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      // Connect to Gemini Live
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: ['AUDIO' as any],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: 'You are IVS-1, an advanced AI admission advisor for Iqra Virtual School. You are an animated avatar guiding parents. Be enthusiastic, futuristic, and helpful. Guide them through the registration form, explain the British and Federal curriculums, and help them book a trial. Keep answers concise to allow for quick interactions.',
        },
        callbacks: {
          onopen: () => {
            console.log('Gemini Live Connection Opened');
            setIsConnecting(false);
            setIsActive(true);

            // Start processing input audio
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

               // Sync timing
               nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);

               const audioBuffer = await decodeAudioData(
                 decode(base64Audio),
                 ctx,
                 24000,
                 1
               );

               const source = ctx.createBufferSource();
               source.buffer = audioBuffer;
               source.connect(outputNode);
               
               source.addEventListener('ended', () => {
                 sourcesRef.current.delete(source);
               });

               source.start(nextStartTimeRef.current);
               sourcesRef.current.add(source);
               nextStartTimeRef.current += audioBuffer.duration;
            }
            
            // Handle interruption
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            console.log('Gemini Live Connection Closed');
            disconnect();
          },
          onerror: (err) => {
            console.error('Gemini Live Error', err);
            setError('Connection failed. Please try again.');
            disconnect();
          }
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (err) {
      console.error('Failed to connect:', err);
      setError('Could not access microphone or connect.');
      setIsConnecting(false);
      setIsActive(false);
    }
  };

  useEffect(() => {
    return () => disconnect();
  }, []);

  // --- UI RENDER ---

  // IDLE STATE (Before Click)
  if (!isActive && !isConnecting) {
    if (variant === 'sidebar') {
       return (
         <div 
           className="glass-panel p-4 rounded-2xl border border-brand-orange/30 relative overflow-hidden group cursor-pointer transition-all hover:bg-white/60 animate-fade-in-up"
           onClick={connect}
         >
            {/* "Any help needed?" Bubble */}
            <div className="absolute -top-3 right-4 bg-white text-brand-dark text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-cyan-500/20 z-20 animate-bounce">
               Any help needed?
            </div>

            <div className="flex items-center gap-4">
               {/* Realistic Avatar Face (SVG) */}
               <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden border border-brand-orange/30 bg-brand-cream/50">
                  <HumanAvatarIdle />
               </div>
               
               <div>
                  <h3 className="font-display font-bold text-brand-darkText text-sm tracking-wide">AI Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-xs text-brand-burgundy font-medium uppercase">Online Now</p>
                  </div>
               </div>
            </div>

            {/* Handshake Animation - "Shaking Hand" */}
            <div className="absolute bottom-3 right-5 text-brand-burgundy drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
               {/* Custom Hand Icon SVG that waves/shakes */}
               <div className="animate-[pulse_1.5s_ease-in-out_infinite] origin-bottom-right transform hover:scale-110 transition-transform">
                 <Hand className="w-6 h-6 rotate-12" />
               </div>
            </div>
         </div>
       );
    }
    
    // Floating Button for Mobile - Using a Div instead to ensure visibility
return (
  <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-30">
    <button
      onClick={connect}
      className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-[0_8px_24px_rgba(34,211,238,0.22)] hover:shadow-[0_12px_34px_rgba(34,211,238,0.32)] transition-all duration-300 hover:scale-105 relative"
      title="Start IVS Advisor"
    >
      <div className="absolute inset-0 bg-brand-orange/10 rounded-full animate-ping opacity-20"></div>
      <img
        src="/images/assistant-sofa.png"
        alt="AI Assistant"
        className="w-full h-full rounded-full object-cover transition-opacity duration-300"
        style={{
          objectPosition: 'center',
          boxShadow: '0 0 16px rgba(34, 211, 238, 0.28)'
        }}
      />
    </button>
    {error && (
      <span className="absolute -top-12 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded w-32 text-center shadow-lg">
        {error}
      </span>
    )}
  </div>
);
  }

  // ACTIVE STATE (Connected/Connecting)
  
  if (variant === 'sidebar') {
    return (
     <div className="glass-panel p-4 rounded-[2rem] border border-brand-orange/50 shadow-[0_0_24px_rgba(34,211,238,0.12)] bg-brand-cream/80 flex flex-col items-center animate-fade-in relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-2 z-10">
          <div className="flex items-center gap-2 text-brand-burgundy">
             <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></div>
             <span className="text-xs font-bold font-display tracking-widest uppercase">Live Session</span>
          </div>
          <button onClick={disconnect} className="text-brand-mediumText hover:text-brand-darkText transition-colors p-1 hover:bg-white/70 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Holographic Avatar */}
        <div className="relative z-10">
          {isConnecting ? (
            <div className="w-32 h-32 flex flex-col items-center justify-center gap-3 text-brand-burgundy/70">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-[10px] font-mono">CONNECTING...</span>
            </div>
          ) : (
            <HolographicAvatarActive isSpeaking={isAgentSpeaking} volume={volume} />
          )}
        </div>

        {/* Status Text */}
        <div className="text-center mt-2 h-5 z-10">
           {!isConnecting && (
             isAgentSpeaking ? (
               <span className="text-xs font-medium text-brand-burgundy animate-pulse">Speaking...</span>
             ) : (
               <span className="text-xs font-medium text-brand-mediumText">Listening...</span>
             )
           )}
        </div>
      </div>
    );
  }

  // Floating Active State (Mobile)
return (
  <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-30 animate-fade-in-up w-[calc(100vw-1.5rem)] max-w-[320px] sm:max-w-[340px]">
    <div className="glass-panel p-4 sm:p-5 rounded-[2rem] border border-brand-orange/30 shadow-[0_0_32px_rgba(34,211,238,0.16)] backdrop-blur-xl bg-brand-cream/90 flex flex-col items-center w-full">
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-2">
          <div className="flex items-center gap-2 text-brand-burgundy">
             <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></div>
             <span className="text-xs font-bold font-display tracking-widest uppercase">IVS-1 Advisor</span>
          </div>
          <button onClick={disconnect} className="text-brand-mediumText hover:text-brand-darkText transition-colors p-1 hover:bg-white/70 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Holographic Avatar */}
<div className="relative scale-[0.88] sm:scale-100">
  {isConnecting ? (
    <div className="w-28 h-28 sm:w-36 sm:h-36 flex flex-col items-center justify-center gap-3 text-brand-burgundy/70">
      <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin" />
      <span className="text-[10px] sm:text-xs font-mono text-center">ESTABLISHING UPLINK...</span>
    </div>
  ) : (
    <HolographicAvatarActive isSpeaking={isAgentSpeaking} volume={volume} />
  )}
</div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-6 w-full">
           <button 
             onClick={disconnect}
             className="flex-1 py-3 rounded-xl bg-white/60 border border-brand-lightGray hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-brand-mediumText text-xs font-bold uppercase tracking-wider transition-all"
           >
             End Session
           </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAgent;
