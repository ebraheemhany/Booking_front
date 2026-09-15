import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/component_items/ThemeProvider";
import "../globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Playfair_Display, Inter } from "next/font/google";
import Header from "@/component_items/header";
import { Footer } from "@/component_items/footer";
import { routing } from "@/i18n/routing";
import { CurrencyProvider } from "@/component_items/context/CurrencyContext";
import StoreProvider from "@/store/StoreProvider";
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Masar",
  description: "",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const isRtl = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isRtl ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <CurrencyProvider>
            <ThemeProvider>
              <StoreProvider>
                <QueryProvider>
                  <Header />
                  {children}
                  <Footer />
                </QueryProvider>
              </StoreProvider>
            </ThemeProvider>
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
