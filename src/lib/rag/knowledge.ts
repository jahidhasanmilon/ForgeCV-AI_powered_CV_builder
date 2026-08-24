export interface KnowledgeChunk {
  id: string;
  title: string;
  text: string;
}

/**
 * This is the "document store" for our RAG pipeline. In a production app
 * these chunks would live in a vector database (e.g. Pinecone, pgvector).
 * For this demo they're plain in-memory text so the whole retrieval
 * pipeline is easy to read end-to-end in src/lib/rag/retrieve.ts.
 */
export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: "ats-basics",
    title: "ATS formatting basics",
    text: "Applicant Tracking Systems (ATS) parse resumes as plain text before a human ever sees them. Avoid tables, text boxes, columns, headers/footers, and images, since many ATS parsers misread or drop them entirely. Use standard section headings like Experience, Education, and Skills so the parser can classify content correctly. Stick to common fonts such as Arial, Calibri, or Times New Roman.",
  },
  {
    id: "ats-keywords",
    title: "Keyword matching for ATS",
    text: "ATS software and recruiters scan for exact and near-exact keyword matches between the resume and the job description, especially for hard skills, tools, and certifications. Mirror the exact phrasing used in the posting (e.g. 'REST API' vs 'RESTful services') and place important keywords in both the skills section and the experience bullets, not just one place.",
  },
  {
    id: "bullet-writing",
    title: "Writing strong resume bullets",
    text: "Strong resume bullets start with a concrete action verb (built, led, optimized, launched), describe what was done and for whom, and quantify the result when a real number is available (users, revenue, time saved, percentage improvement). Never invent numbers that aren't true. Avoid first-person pronouns and keep each bullet to one line where possible.",
  },
  {
    id: "germany-lebenslauf",
    title: "Germany: Lebenslauf conventions",
    text: "Traditional German CVs (Lebenslauf) sometimes include a photo, date of birth, and nationality, and are often laid out in reverse-chronological, tabular form. However, modern international and tech companies in Germany increasingly accept English-language, photo-free, ATS-style CVs, especially at startups and multinational firms. A CV submitted in Germany is almost always expected to be accompanied by a cover letter (Anschreiben) — treat it as required, not optional.",
  },
  {
    id: "usa-resume",
    title: "USA: resume conventions",
    text: "US resumes never include a photo, date of birth, or marital status due to anti-discrimination hiring law, and recruiters may discard resumes that include them. Most US resumes are one page for early-career candidates and are written in a resume format that is heavily ATS-optimized, since almost all large US employers use ATS platforms like Workday or Greenhouse.",
  },
  {
    id: "europe-europass",
    title: "Europe: Europass and CEFR language levels",
    text: "Many European employers are familiar with the Europass CV structure. Language proficiency should be stated using CEFR levels (A1-C2) rather than vague terms like 'fluent' or 'intermediate', since CEFR is the standard reference recruiters expect across the EU.",
  },
  {
    id: "opportunity-card",
    title: "Germany Opportunity Card (Chancenkarte)",
    text: "The German Opportunity Card (Chancenkarte) is a points-based residence permit that lets qualified non-EU applicants move to Germany to search for a job in person. It rewards qualifications, German or English language skills, professional experience, and age. Once in Germany, applicants can work part-time and interview locally while searching for a permanent role, which candidates often mention explicitly in their CV profile summary.",
  },
  {
    id: "target-summary",
    title: "Writing a targeted profile summary",
    text: "A resume profile/summary section performs best when it names the target role and target market in the first two lines, briefly signals the candidate's core stack or specialty, and states any relevant relocation or visa status so recruiters don't have to guess about logistics.",
  },
];
