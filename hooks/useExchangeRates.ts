import { useQuery } from "@tanstack/react-query";

interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
}

async function fetchExchangeRates(): Promise<ExchangeRates> {
  const res = await fetch("/api/exchange-rates");
  if (!res.ok) throw new Error("Failed to fetch exchange rates");
  return res.json();
}

export function useExchangeRates() {
  return useQuery({
    queryKey: ["exchange-rates"],
    queryFn: fetchExchangeRates,
    staleTime: 60 * 60 * 1000, // ساعة كاملة، أسعار الصرف مش بتتغير كل دقيقة
    refetchInterval: 60 * 60 * 1000,
  });
}
