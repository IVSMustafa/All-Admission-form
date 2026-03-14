import { School, GraduationCap, BookOpen, BookHeart } from "lucide-react";
import { LeadType } from "../../types";

const PROGRAM_CARDS_DATA = [
  {
    id: LeadType.FULL_TIME,
    title: "Full-Time Schooling",
    description:
      "Structured online school for KG1 to Grade 12 with live lessons, daily guidance, progress tracking, and a balanced academic journey.",
    badge: "Most Popular",
    ctaLabel: "Explore",
    accent: "blue" as const,
    icon: School,
    features: [
      "Live daily classes",
      "Structured timetable",
      "Progress reports",
      "Parent portal",
    ],
  },
  {
    id: LeadType.TUITION,
    title: "One-to-One Tuition",
    description:
      "Private subject coaching with focused attention, flexible pacing, exam preparation, and a learning plan built around the student.",
    badge: "Flexible",
    ctaLabel: "Explore",
    accent: "violet" as const,
    icon: BookOpen,
    features: [
      "Private teacher support",
      "Exam preparation",
      "Flexible timing options",
      "Custom learning pace",
    ],
  },
  {
    id: LeadType.ONE_ON_ONE_SCHOOLING,
    title: "One-to-One Schooling",
    description:
      "A complete personalized school experience with a dedicated teacher, full curriculum support, stronger attention, and guided growth.",
    badge: "Personal Teacher",
    ctaLabel: "Explore",
    accent: "amber" as const,
    icon: GraduationCap,
    features: [
      "Dedicated class teacher",
      "Personal academic focus",
      "Weekly performance review",
      "Certificate support",
    ],
  },
  {
    id: LeadType.QURAN,
    title: "Quran Classes",
    description:
      "Beautifully guided Quran learning with qualified teachers for Qaida, Nazira, Tajweed, Hifz, and flexible timings for students worldwide.",
    badge: "Certified Scholars",
    ctaLabel: "Explore",
    accent: "emerald" as const,
    icon: BookHeart,
    features: [
      "Qaida, Nazira, Tajweed",
      "Hifz and revision support",
      "Male and female teachers",
      "Flexible global timings",
    ],
  },
];

export default PROGRAM_CARDS_DATA;
export { PROGRAM_CARDS_DATA };