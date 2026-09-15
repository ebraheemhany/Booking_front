import { useLocale } from "next-intl";

import { useExchangeRates } from "./useExchangeRates";
import { useCurrency } from "@/component_items/context/CurrencyContext";

export function useConvertedPrice(priceInEGP: number) {
  const { currency } = useCurrency();
  const { data: rates, isLoading } = useExchangeRates();
  const locale = useLocale();

  const rate = rates?.rates[currency] ?? 1;
  const convertedPrice = priceInEGP * rate;

  const formattedPrice = new Intl.NumberFormat(`${locale}-u-nu-latn`, {
    maximumFractionDigits: currency === "EGP" ? 0 : 2,
  }).format(convertedPrice);

  return {
    convertedPrice,
    formattedPrice,
    currency,
    isLoading: isLoading || !rates,
  };
}
