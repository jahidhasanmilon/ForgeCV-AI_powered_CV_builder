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

export interface ProjectEntry {
  title: string;
  link: string;
  tech: string;
  bullets: string[];
}

/** ISO 3166-1 alpha-2 codes for the target-country lookup panel */
export type TargetCountryCode = "DE" | "US" | "GB" | "general";

export interface CvData {
  personal: PersonalInfo;
  targetCountry: TargetCountryCode;
  summary: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: string[];
}

export const EMPTY_CV: CvData = {
  personal: { name: "", email: "", phone: "", location: "", linkedin: "" },
  targetCountry: "general",
  summary: "",
  education: [{ degree: "", institution: "", location: "", start: "", end: "", details: "" }],
  experience: [{ title: "", company: "", location: "", start: "", end: "", bullets: [""] }],
  projects: [],
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
