export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  location: string;
  start: string;
  end: string;
  details: string;
}

export interface ExperienceEntry {
  title: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
}

/** ISO 3166-1 alpha-2 codes for the target-country lookup panel */
export type TargetCountryCode = "DE" | "US" | "GB" | "general";

export interface CvData {
  personal: PersonalInfo;
  targetCountry: TargetCountryCode;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: string[];
}

export const EMPTY_CV: CvData = {
  personal: { name: "", email: "", phone: "", location: "", linkedin: "" },
  targetCountry: "general",
  education: [{ degree: "", institution: "", location: "", start: "", end: "", details: "" }],
  experience: [{ title: "", company: "", location: "", start: "", end: "", bullets: [""] }],
  skills: [],
};

export interface JobMatchResult {
  score: number;
  missing: string[];
  tip: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  toolsUsed?: string[];
}
