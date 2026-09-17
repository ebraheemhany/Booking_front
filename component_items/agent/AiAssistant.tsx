"use client";

import { useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { useLocale, useTranslations } from "next-intl";
import { Send, Sparkles, X } from "lucide-react";
import { useAiAssistantContext } from "./AiAssistantContext";
import { resolveLocation } from "./resolveLocation";
import { mockCars } from "@/data/mockCars";
import { mockHotelDetails } from "@/component_items/hotels/mockHotelDetails";
import type {
  HotelDetails,
  RoomOption,
} from "@/component_items/hotels/HotelCard";
import type { AppDispatch } from "@/store/store";
import { setBookingData } from "@/store/slices/bookingSlice";
import { setStaySearchData } from "@/store/slices/staySearchSlice";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CarBookingCriteria {
  tripType: "arrival" | "departure" | "private" | "dailyRental";
  fromLocation?: string;
  toLocation?: string;
  date: string;
  time?: string;
  passengers?: number;
  preferredCategory?: string;
  maxBudget?: number;
}

interface ToolArguments extends Partial<CarBookingCriteria> {
  selector?: string;
  path?: string;
}

const hotelList = mockHotelDetails;

const EXCLUDED_PATH_SEGMENTS = ["/auth", "/login", "/signup", "/register"];

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { handlers } = useAiAssistantContext();
  const lastHotelListRef = useRef<HotelDetails[]>([]);
  const lastRoomListRef = useRef<{
    hotel: HotelDetails | null;
    rooms: RoomOption[];
  }>({ hotel: null, rooms: [] });
  const lastHotelSearchRef = useRef<{
    checkIn?: string;
    checkOut?: string;
    adults?: number;
    children?: number;
  }>({});

  // locale اللي المستخدم شغال عليه دلوقتي في الموقع (من next-intl) — احتياطي بس
  const locale = useLocale();
  const t = useTranslations("aiAssistant");

  const isExcludedPage = EXCLUDED_PATH_SEGMENTS.some((segment) =>
    pathname?.includes(segment),
  );

  // ← منطق حجز العربية، شغال من أي صفحة (مش معتمد على handlers صفحة lemozeen)
  const bookCarGlobally = async (criteria: CarBookingCriteria) => {
    let candidates = mockCars;

    if (criteria.preferredCategory) {
      candidates = candidates.filter(
        (c) => c.specs.category === criteria.preferredCategory,
      );
    }

    if (criteria.maxBudget) {
      candidates = candidates.filter(
        (c) =>
          (c.pricing[criteria.tripType]?.price ?? Infinity) <=
          criteria.maxBudget!,
      );
    }

    if (candidates.length === 0) {
      return t("tool.noCarMatch");
    }

    const chosenCar = candidates.reduce((cheapest, current) => {
      const cheapestPrice =
        cheapest.pricing[criteria.tripType]?.price ?? Infinity;
      const currentPrice =
        current.pricing[criteria.tripType]?.price ?? Infinity;
      return currentPrice < cheapestPrice ? current : cheapest;
    });

    const [pointA, pointB] = await Promise.all([
      resolveLocation(criteria.fromLocation),
      resolveLocation(criteria.toLocation),
    ]);

    dispatch(
      setBookingData({
        source: "agent",
        tripType: criteria.tripType,
        pickup: pointA,
        dropoff: pointB,
        date: criteria.date,
        time: criteria.time ?? "",
        passengers: criteria.passengers ?? 1,
        luggage: 0,
        selectedCar: chosenCar,
      }),
    );

    router.push(`/feature/lemozeen/${chosenCar.specs.id}/booking`);

    return t("tool.carChosen", { carName: chosenCar.specs.name.ar });
  };

  const recommendHotelsGlobally = (criteria: {
    destination: string;
    checkIn: string;
    checkOut: string;
    adults?: number;
    children?: number;
    minStars?: number;
    maxBudget?: number;
  }) => {
    let candidates = hotelList.filter(
      (hotel) =>
        hotel.location.ar.includes(criteria.destination) ||
        hotel.location.en
          .toLowerCase()
          .includes(criteria.destination.toLowerCase()),
    );

    if (candidates.length === 0) candidates = hotelList;
    if (criteria.minStars) {
      candidates = candidates.filter(
        (hotel) => hotel.stars >= criteria.minStars!,
      );
    }
    if (criteria.maxBudget) {
      candidates = candidates.filter(
        (hotel) => hotel.pricePerNight <= criteria.maxBudget!,
      );
    }

    if (candidates.length === 0) {
      lastHotelListRef.current = [];
      return "معلش، مفيش فنادق مطابقة للمعايير دي دلوقتي 😕";
    }

    lastHotelListRef.current = candidates;
    lastHotelSearchRef.current = criteria;
    const listText = candidates
      .map(
        (hotel, index) =>
          `${index + 1}. ${hotel.name.ar} — ${hotel.location.ar} — ${"★".repeat(hotel.stars)} — ${hotel.pricePerNight} جنيه/الليلة`,
      )
      .join("\n");

    return `لقيتلك دول:\n${listText}\n\nاختار رقم الفندق أو قولّي اسمه`;
  };

  const selectHotelGlobally = (selector: string) => {
    const list = lastHotelListRef.current;
    if (list.length === 0) return "محتاج تدور على فنادق الأول قبل ما تختار 🙂";

    const index = parseInt(selector.trim(), 10);
    const hotel =
      (Number.isNaN(index) ? undefined : list[index - 1]) ??
      list.find(
        (item) =>
          item.name.ar.includes(selector) ||
          item.name.en.toLowerCase().includes(selector.toLowerCase()),
      );

    if (!hotel)
      return "معرفتش أحدد الفندق ده، جرب تكتب رقمه من القائمة اللي فاتت";

    lastRoomListRef.current = { hotel, rooms: hotel.rooms };
    const roomsText = hotel.rooms
      .map(
        (room, roomIndex) =>
          `${roomIndex + 1}. ${room.name.ar} — ${room.sizeSqm} م² — يتسع لـ ${room.maxGuests} — ${room.basePrice} جنيه/الليلة`,
      )
      .join("\n");

    return `${hotel.name.ar} — الغرف المتاحة:\n${roomsText}\n\nاختار رقم الغرفة أو قولّي اسمها`;
  };

  const selectRoomGlobally = (selector: string) => {
    const { hotel, rooms } = lastRoomListRef.current;
    if (!hotel || rooms.length === 0)
      return "محتاج تختار فندق الأول قبل ما تختار غرفة 🙂";

    const index = parseInt(selector.trim(), 10);
    const room =
      (Number.isNaN(index) ? undefined : rooms[index - 1]) ??
      rooms.find(
        (item) =>
          item.name.ar.includes(selector) ||
          item.name.en.toLowerCase().includes(selector.toLowerCase()),
      );

    if (!room)
      return "معرفتش أحدد الغرفة دي، جرب تكتب رقمها من القائمة اللي فاتت";

    const criteria = lastHotelSearchRef.current;
    dispatch(
      setStaySearchData({
        destination: { key: hotel.location.ar, label: hotel.location.ar },
        checkIn: criteria.checkIn ?? null,
        checkOut: criteria.checkOut ?? null,
        adults: criteria.adults ?? 2,
        children: criteria.children ?? 0,
      }),
    );
    router.push(`/feature/stays/${hotel.id}/checkOut?roomId=${room.id}`);

    return `تمام، اخترت ${room.name.ar} في ${hotel.name.ar} — راجع بياناتك في صفحة تأكيد الحجز وكمّل من هناك`;
  };

  const executeTool = async (
    toolName: string,
    args: ToolArguments,
  ): Promise<string> => {
    switch (toolName) {
      case "fill_trip_search":
        // ده لسه محتاج تكون واقف في صفحة lemozeen (بيملأ فورم على الشاشة فعليًا)
        await handlers.onFillTripSearch?.(args);
        return handlers.onFillTripSearch
          ? t("tool.tripFilled")
          : t("tool.pageOnly", { page: t("pages.carBooking") });

      case "navigate_to_page":
        if (!args.path) return t("tool.done");
        router.push(args.path);
        return t("tool.navigated");

      case "book_car":
        // ← بقى شغال من أي صفحة في الموقع
        if (
          !args.tripType ||
          !args.fromLocation ||
          !args.toLocation ||
          !args.date
        ) {
          return t("tool.done");
        }
        return await bookCarGlobally(args as CarBookingCriteria);

      case "recommend_hotels": {
        return recommendHotelsGlobally(
          args as Parameters<typeof recommendHotelsGlobally>[0],
        );
      }

      case "select_hotel": {
        if (!args.selector) return t("tool.done");
        return selectHotelGlobally(args.selector);
      }

      case "select_room": {
        if (!args.selector) return t("tool.done");
        return selectRoomGlobally(args.selector);
      }

      default:
        return t("tool.done");
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
          // الباك إند يستخدم ده كاحتياطي فقط لأول رسالة في المحادثة
          locale,
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
          const result = await executeTool(call.name, call.args);
          replyText += (replyText ? "\n\n" : "") + result;
        }
      }

      setMessages([...newMessages, { role: "assistant", content: replyText }]);
    } catch (err) {
      console.error("Request failed:", err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: t("connectionError") },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isExcludedPage) {
    return null;
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 inset-e-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-black shadow-lg hover:bg-amber-400"
      >
        <Sparkles className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 inset-e-6 z-50 flex h-125 w-96 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d1728] shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <p className="flex items-center gap-2 text-sm font-bold text-white">
          <Sparkles className="h-4 w-4 text-amber-400" />
          {t("title")}
        </p>
        <button onClick={() => setOpen(false)}>
          <X className="h-4 w-4 text-white/50" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[90%] rounded-xl px-3 py-2 text-sm whitespace-pre-line ${
              m.role === "user"
                ? "ms-auto bg-amber-500 text-black"
                : "bg-white/5 text-white"
            }`}
          >
            {m.content}
          </div>
        ))}
        {isLoading && (
          <div className="flex w-fit items-center gap-1 rounded-xl bg-white/5 px-4 py-3">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground" />
          </div>
        )}
      </div>

      <div className="flex items-end gap-2 border-t border-white/10 p-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder={t("inputPlaceholder")}
          rows={1}
          className="max-h-32 flex-1 resize-none overflow-y-auto rounded-lg bg-white/5 px-3 py-2 text-sm text-white placeholder:text-amber-200/40 focus:outline-none"
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
          }}
        />
        <button
          onClick={sendMessage}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-black hover:bg-amber-400"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
