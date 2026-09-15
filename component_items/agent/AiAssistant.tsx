"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Sparkles, X } from "lucide-react";
import type { TripDetailsData } from "@/component_items/booking/TripDetailsStep";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AiAssistantProps {
  onFillTripSearch?: (data: Partial<TripDetailsData>) => void;
}

export function AiAssistant({ onFillTripSearch }: AiAssistantProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const executeTool = (toolName: string, input: any) => {
    switch (toolName) {
      case "fill_trip_search":
        onFillTripSearch?.(input);
        return "تم ملء بيانات الرحلة، راجعها واضغط بحث";
      case "search_hotels":
        return "بدور على الفنادق المناسبة...";
      case "navigate_to_page":
        router.push(input.path);
        return "تم فتح الصفحة";
      default:
        return "تم التنفيذ";
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      let replyText = data.text ?? "";

      if (data.functionCalls?.length) {
        for (const call of data.functionCalls) {
          const result = executeTool(call.name, call.args);
          replyText += (replyText ? "\n" : "") + result;
        }
      }

      setMessages([...newMessages, { role: "assistant", content: replyText }]);
    } catch (err) {
      console.error("Request failed:", err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "حصل خطأ في الاتصال" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 end-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-black shadow-lg hover:bg-amber-400"
      >
        <Sparkles className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 end-6 z-50 flex h-[500px] w-96 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d1728] shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <p className="flex items-center gap-2 text-sm font-bold text-white">
          <Sparkles className="h-4 w-4 text-amber-400" />
          مساعد مسار
        </p>
        <button onClick={() => setOpen(false)}>
          <X className="h-4 w-4 text-white/50" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
              m.role === "user"
                ? "ms-auto bg-amber-500 text-black"
                : "bg-white/5 text-white"
            }`}
          >
            {m.content}
          </div>
        ))}
        {isLoading && (
          <div className="max-w-[85%] rounded-xl bg-white/5 px-3 py-2 text-sm text-white/50">
            جارٍ الكتابة...
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-white/10 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="اكتب طلبك..."
          className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-black hover:bg-amber-400"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
