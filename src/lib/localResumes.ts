import { CvData, EMPTY_CV } from "./types";
import { ResumeDoc, ResumeMeta } from "./resumes";

const STORAGE_KEY = "forgecv_local_resumes";

function readAll(): ResumeDoc[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ResumeDoc[]) : [];
  } catch {
    return [];
  }
}

function writeAll(resumes: ResumeDoc[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
}

export async function listLocalResumes(): Promise<ResumeMeta[]> {
  return readAll()
    .map(({ id, name, updatedAt }) => ({ id, name, updatedAt }))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function createLocalResume(name: string): Promise<string> {
  const id = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const all = readAll();
  all.push({ id, name, cv: EMPTY_CV, updatedAt: Date.now() });
  writeAll(all);
  return id;
}

export async function getLocalResume(id: string): Promise<ResumeDoc | null> {
  return readAll().find((r) => r.id === id) ?? null;
}

export async function saveLocalResume(id: string, cv: CvData): Promise<void> {
  const all = readAll();
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], cv, updatedAt: Date.now() };
  writeAll(all);
}

export async function renameLocalResume(id: string, name: string): Promise<void> {
  const all = readAll();
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], name };
  writeAll(all);
}

export async function deleteLocalResume(id: string): Promise<void> {
  writeAll(readAll().filter((r) => r.id !== id));
}
