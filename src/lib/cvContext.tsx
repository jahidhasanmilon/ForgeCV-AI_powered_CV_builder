"use client";

import React, { createContext, useContext, useMemo, useReducer } from "react";
import { CvData, EMPTY_CV } from "./types";

type Action =
  | { type: "SET_PERSONAL"; field: keyof CvData["personal"]; value: string }
  | { type: "SET_COUNTRY"; value: CvData["targetCountry"] }
  | { type: "SET_EDU"; index: number; field: string; value: string }
  | { type: "ADD_EDU" }
  | { type: "REMOVE_EDU"; index: number }
  | { type: "SET_EXP"; index: number; field: string; value: string }
  | { type: "SET_BULLET"; expIndex: number; bulletIndex: number; value: string }
  | { type: "ADD_BULLET"; expIndex: number }
  | { type: "REMOVE_BULLET"; expIndex: number; bulletIndex: number }
  | { type: "ADD_EXP" }
  | { type: "REMOVE_EXP"; index: number }
  | { type: "ADD_SKILL"; value: string }
  | { type: "REMOVE_SKILL"; index: number }
  | { type: "LOAD"; data: CvData };

function reducer(state: CvData, action: Action): CvData {
  switch (action.type) {
    case "SET_PERSONAL":
      return { ...state, personal: { ...state.personal, [action.field]: action.value } };
    case "SET_COUNTRY":
      return { ...state, targetCountry: action.value };
    case "SET_EDU": {
      const education = [...state.education];
      education[action.index] = { ...education[action.index], [action.field]: action.value };
      return { ...state, education };
    }
    case "ADD_EDU":
      return {
        ...state,
        education: [
          ...state.education,
          { degree: "", institution: "", location: "", start: "", end: "", details: "" },
        ],
      };
    case "REMOVE_EDU":
      return { ...state, education: state.education.filter((_, i) => i !== action.index) };
    case "SET_EXP": {
      const experience = [...state.experience];
      experience[action.index] = { ...experience[action.index], [action.field]: action.value };
      return { ...state, experience };
    }
    case "SET_BULLET": {
      const experience = [...state.experience];
      const bullets = [...experience[action.expIndex].bullets];
      bullets[action.bulletIndex] = action.value;
      experience[action.expIndex] = { ...experience[action.expIndex], bullets };
      return { ...state, experience };
    }
    case "ADD_BULLET": {
      const experience = [...state.experience];
      experience[action.expIndex] = {
        ...experience[action.expIndex],
        bullets: [...experience[action.expIndex].bullets, ""],
      };
      return { ...state, experience };
    }
    case "REMOVE_BULLET": {
      const experience = [...state.experience];
      experience[action.expIndex] = {
        ...experience[action.expIndex],
        bullets: experience[action.expIndex].bullets.filter((_, i) => i !== action.bulletIndex),
      };
      return { ...state, experience };
    }
    case "ADD_EXP":
      return {
        ...state,
        experience: [
          ...state.experience,
          { title: "", company: "", location: "", start: "", end: "", bullets: [""] },
        ],
      };
    case "REMOVE_EXP":
      return { ...state, experience: state.experience.filter((_, i) => i !== action.index) };
    case "ADD_SKILL":
      return { ...state, skills: [...state.skills, action.value] };
    case "REMOVE_SKILL":
      return { ...state, skills: state.skills.filter((_, i) => i !== action.index) };
    case "LOAD":
      return action.data;
    default:
      return state;
  }
}

interface CvContextValue {
  data: CvData;
  dispatch: React.Dispatch<Action>;
}

const CvContext = createContext<CvContextValue | null>(null);

export function CvProvider({
  children,
  initial = EMPTY_CV,
}: {
  children: React.ReactNode;
  initial?: CvData;
}) {
  const [data, dispatch] = useReducer(reducer, initial);
  const value = useMemo(() => ({ data, dispatch }), [data]);
  return <CvContext.Provider value={value}>{children}</CvContext.Provider>;
}

export function useCv() {
  const ctx = useContext(CvContext);
  if (!ctx) throw new Error("useCv must be used inside <CvProvider>");
  return ctx;
}
