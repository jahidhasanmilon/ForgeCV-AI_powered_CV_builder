export interface CountryInfo {
  name: string;
  capital: string;
  region: string;
  languages: string[];
  currency: string;
  flagEmoji: string;
}

/**
 * Third-party API integration: restcountries.com (free, no API key required).
 * Used to show a quick factual snapshot of the candidate's target country.
 */
export async function lookupCountry(code: string): Promise<CountryInfo | null> {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`, {
      // Country facts barely change; cache for a day to avoid hammering the API.
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return null;
    const [data] = await res.json();
    if (!data) return null;

    const currencyValues = data.currencies
      ? (Object.values(data.currencies) as { name?: string }[])
      : [];

    return {
      name: data.name?.common ?? code,
      capital: (data.capital ?? [])[0] ?? "N/A",
      region: data.region ?? "N/A",
      languages: data.languages ? (Object.values(data.languages) as string[]) : [],
      currency: currencyValues[0]?.name ?? "N/A",
      flagEmoji: data.flag ?? "",
    };
  } catch {
    return null;
  }
}
