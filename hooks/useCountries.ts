"use client";

import { useEffect, useState } from "react";

export interface Country {
  code: string; // iso2
  nameEn: string;
  flagUrl: string;
}

interface ApiCountry {
  name: string;
  iso2: string;
  iso3: string;
  flag: string;
}

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/flag/images")
      .then((res) => res.json())
      .then((json) => {
        const list: ApiCountry[] = json.data ?? [];
        const mapped: Country[] = list
          .map((c) => ({
            code: c.iso2,
            nameEn: c.name,
            flagUrl: c.flag,
          }))
          .sort((a, b) => a.nameEn.localeCompare(b.nameEn));
        setCountries(mapped);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return { countries, isLoading };
}
