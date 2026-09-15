import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en", "ru", "de", "es", "uk", "pl"],
  defaultLocale: "ar",
});
