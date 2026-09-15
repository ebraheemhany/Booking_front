"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CURRENCY_COOKIE = "currency";
const DEFAULT_CURRENCY = "EGP";

interface CurrencyContextValue {
  currency: string;
  setCurrency: (currency: string) => void;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
});

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState(DEFAULT_CURRENCY);

  // قراءة العملة المحفوظة في الكوكيز عند تحميل الموقع لأول مرة
  useEffect(() => {
    const saved = getCookie(CURRENCY_COOKIE);
    if (saved) setCurrencyState(saved);
  }, []);

  function setCurrency(newCurrency: string) {
    setCurrencyState(newCurrency);
    document.cookie = `${CURRENCY_COOKIE}=${newCurrency}; path=/; max-age=31536000`;
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
