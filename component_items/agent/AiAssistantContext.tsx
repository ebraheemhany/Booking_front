"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

interface BookResult {
  success: boolean;
  message: string;
}

export interface AiHandlers {
  onFillTripSearch?: (data: any) => void | Promise<void>;
  onBookCar?: (criteria: any) => BookResult | Promise<BookResult>;
  onRecommendHotels?: (criteria: any) => string | Promise<string>;
  onSelectHotel?: (selector: string) => string | Promise<string>;
  onSelectRoom?: (selector: string) => string | Promise<string>;
}

interface AiAssistantContextValue {
  handlers: AiHandlers;
  setHandlers: (handlers: AiHandlers) => void;
}

const AiAssistantContext = createContext<AiAssistantContextValue | null>(null);

export function AiAssistantProvider({ children }: { children: ReactNode }) {
  const [handlers, setHandlersState] = useState<AiHandlers>({});

  const setHandlers = useCallback((newHandlers: AiHandlers) => {
    setHandlersState(newHandlers);
  }, []);

  return (
    <AiAssistantContext.Provider value={{ handlers, setHandlers }}>
      {children}
    </AiAssistantContext.Provider>
  );
}

export function useAiAssistantContext() {
  const ctx = useContext(AiAssistantContext);
  if (!ctx) {
    throw new Error(
      "useAiAssistantContext must be used inside AiAssistantProvider",
    );
  }
  return ctx;
}

/**
 * هوك تستخدمه أي صفحة عندها منطق خاص (lemozeen، stays...)
 * عشان تسجّل الـ handlers بتاعتها للمساعد العام، وتشيلها تلقائيًا
 * لما المستخدم يسيب الصفحة.
 */
export function useRegisterAiHandlers(handlers: AiHandlers) {
  const { setHandlers } = useAiAssistantContext();

  useEffect(() => {
    setHandlers(handlers);
    return () => setHandlers({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
