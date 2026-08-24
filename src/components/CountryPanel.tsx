"use client";

import { useEffect, useState } from "react";
import { CountryInfo } from "@/lib/countryApi";

export default function CountryPanel({ countryCode }: { countryCode: string }) {
  const [info, setInfo] = useState<CountryInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (countryCode === "general") {
      setInfo(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/country?code=${countryCode}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!cancelled) setInfo(json);
      })
      .catch(() => !cancelled && setInfo(null))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [countryCode]);

  if (countryCode === "general") return null;

  return (
    <div className="country-tip" style={{ borderLeft: "3px solid var(--teal)" }}>
      {loading && <span>দেশের তথ্য লোড হচ্ছে…</span>}
      {!loading && info && (
        <span>
          <strong>
            {info.flagEmoji} {info.name}
          </strong>{" "}
          — capital: {info.capital}, languages: {info.languages.join(", ") || "N/A"}, currency:{" "}
          {info.currency}
          <br />
          <span style={{ fontSize: 10.5, color: "var(--muted)", fontFamily: "IBM Plex Mono, monospace" }}>
            via restcountries.com (live 3rd-party API)
          </span>
        </span>
      )}
      {!loading && !info && <span>দেশের তথ্য এই মুহূর্তে পাওয়া যায়নি।</span>}
    </div>
  );
}
