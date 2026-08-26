import {
  collection,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { CvData, EMPTY_CV } from "./types";

export interface ResumeMeta {
  id: string;
  name: string;
  updatedAt: number;
}

export interface ResumeDoc extends ResumeMeta {
  cv: CvData;
}

function resumesCol(uid: string) {
  return collection(db, "users", uid, "resumes");
}

export async function listResumes(uid: string): Promise<ResumeMeta[]> {
  const snap = await getDocs(query(resumesCol(uid), orderBy("updatedAt", "desc")));
  return snap.docs.map((d) => ({
    id: d.id,
    name: (d.data().name as string) || "Untitled resume",
    updatedAt: (d.data().updatedAt as number) || 0,
  }));
}

export async function createResume(uid: string, name: string): Promise<string> {
  const ref = doc(resumesCol(uid));
  const now = Date.now();
  await setDoc(ref, { name, cv: EMPTY_CV, updatedAt: now, createdAt: now });
  return ref.id;
}

export async function getResume(uid: string, id: string): Promise<ResumeDoc | null> {
  const snap = await getDoc(doc(resumesCol(uid), id));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    name: (data.name as string) || "Untitled resume",
    updatedAt: (data.updatedAt as number) || 0,
    cv: data.cv as CvData,
  };
}

export async function saveResume(uid: string, id: string, cv: CvData): Promise<void> {
  await setDoc(doc(resumesCol(uid), id), { cv, updatedAt: Date.now() }, { merge: true });
}

export async function renameResume(uid: string, id: string, name: string): Promise<void> {
  await setDoc(doc(resumesCol(uid), id), { name }, { merge: true });
}

export async function deleteResume(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(resumesCol(uid), id));
}
