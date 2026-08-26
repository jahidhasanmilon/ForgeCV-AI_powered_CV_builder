"use client";

import { useEffect, useRef } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./authContext";
import { useCv } from "./cvContext";
import { CvData } from "./types";

/** Loads the signed-in user's saved CV from Firestore, then keeps it synced on every change. */
export function useCvSync() {
  const { user } = useAuth();
  const { data, dispatch } = useCv();
  const hydratedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      hydratedFor.current = null;
      return;
    }
    if (hydratedFor.current === user.uid) return;

    let cancelled = false;
    (async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (cancelled) return;
      const savedCv = snap.exists() ? (snap.data().cv as CvData | undefined) : undefined;
      if (savedCv) dispatch({ type: "LOAD", data: savedCv });
      hydratedFor.current = user.uid;
    })();

    return () => {
      cancelled = true;
    };
  }, [user, dispatch]);

  useEffect(() => {
    if (!user || hydratedFor.current !== user.uid) return;
    const ref = doc(db, "users", user.uid);
    const t = setTimeout(() => {
      setDoc(ref, { cv: data, updatedAt: Date.now() }, { merge: true }).catch((e) =>
        console.error("Failed to save CV:", e)
      );
    }, 900);
    return () => clearTimeout(t);
  }, [data, user]);
}
