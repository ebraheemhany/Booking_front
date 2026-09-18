"use client";
import { HeroSection } from "@/component_items/Hero_page_Section";

import {
  StaySearchBar,
  type StaySearchData,
} from "@/component_items/StaySearch/StaySearchBar";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { StayResultsPage } from "@/component_items/hotels/StayResultsPage";
import type { HotelFiltersState } from "@/component_items/hotels/HotelFiltersSheet";
import type {
  HotelCardData,
  HotelDetails,
  RoomOption,
} from "@/component_items/hotels/HotelCard";
import { mockHotelDetails } from "@/component_items/hotels/mockHotelDetails";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { setStaySearchData } from "@/store/slices/staySearchSlice";
// import { AiAssistant } from "@/component_items/agent/AiAssistant";
import { useRegisterAiHandlers } from "@/component_items/agent/AiAssistantContext";
import { SignInBanner } from "@/component_items/SignInBanner";

const mockHotels: HotelCardData[] = mockHotelDetails.map((h) => ({ specs: h }));

export default function StaysPage() {
  const t = useTranslations("HeroStays");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [searchData, setSearchData] = useState<StaySearchData | null>(null);
  const [filters, setFilters] = useState<HotelFiltersState>({
    minStars: null,
    roomType: "all",
    amenities: [],
    minBudget: 500,
    maxBudget: 10000,
  });

  // بنحتفظ بآخر قائمة فنادق/غرف اتعرضت عشان نحل بيها اختيار المستخدم بالرقم أو الاسم
  const lastHotelListRef = useRef<HotelDetails[]>([]);
  const lastRoomListRef = useRef<{ hotel: HotelDetails; rooms: RoomOption[] }>({
    hotel: null as any,
    rooms: [],
  });
  // بنحتفظ ببيانات البحث الأخيرة (تواريخ وضيوف) عشان نستخدمها وقت التنقل النهائي
  const lastSearchCriteriaRef = useRef<{
    checkIn?: string;
    checkOut?: string;
    adults?: number;
    children?: number;
  }>({});

  const handleSearch = (data: StaySearchData) => {
    setSearchData(data);
    dispatch(
      setStaySearchData({
        destination: data.destination,
        checkIn: data.dates.checkIn ? data.dates.checkIn.toISOString() : null,
        checkOut: data.dates.checkOut
          ? data.dates.checkOut.toISOString()
          : null,
        adults: data.guests.adults,
        children: data.guests.children,
      }),
    );
  };

  // ── خطوة 1: ترشيح فنادق وعرضهم كنص مرقّم ──
  const handleRecommendHotels = (criteria: {
    destination: string;
    checkIn: string;
    checkOut: string;
    adults?: number;
    children?: number;
    minStars?: number;
    maxBudget?: number;
  }): string => {
    let candidates = mockHotelDetails.filter(
      (h) =>
        h.location.ar.includes(criteria.destination) ||
        h.location.en
          .toLowerCase()
          .includes(criteria.destination.toLowerCase()),
    );

    if (candidates.length === 0) candidates = mockHotelDetails; // لو مفيش تطابق دقيق، نوري كل الخيارات

    if (criteria.minStars) {
      candidates = candidates.filter((h) => h.stars >= criteria.minStars!);
    }
    if (criteria.maxBudget) {
      candidates = candidates.filter(
        (h) => h.pricePerNight <= criteria.maxBudget!,
      );
    }

    if (candidates.length === 0) {
      lastHotelListRef.current = [];
      return "معلش، مفيش فنادق مطابقة للمعايير دي دلوقتي 😕";
    }

    lastHotelListRef.current = candidates;
    lastSearchCriteriaRef.current = {
      checkIn: criteria.checkIn,
      checkOut: criteria.checkOut,
      adults: criteria.adults,
      children: criteria.children,
    };

    const listText = candidates
      .map(
        (h, i) =>
          `${i + 1}. ${h.name.ar} — ${h.location.ar} — ${"★".repeat(h.stars)} — ${h.pricePerNight} جنيه/الليلة`,
      )
      .join("\n");

    return `لقيتلك دول:\n${listText}\n\nاختار رقم الفندق أو قولّي اسمه`;
  };

  // ── خطوة 2: حل اختيار الفندق وعرض غرفه ──
  const handleSelectHotel = (selector: string): string => {
    const list = lastHotelListRef.current;
    if (list.length === 0) {
      return "محتاج تدور على فنادق الأول قبل ما تختار 🙂";
    }

    let hotel: HotelDetails | undefined;

    const asNumber = parseInt(selector.trim(), 10);
    if (!isNaN(asNumber) && list[asNumber - 1]) {
      hotel = list[asNumber - 1];
    } else {
      hotel = list.find(
        (h) =>
          h.name.ar.includes(selector) ||
          h.name.en.toLowerCase().includes(selector.toLowerCase()),
      );
    }

    if (!hotel) {
      return "معرفتش أحدد الفندق ده، جرب تكتب رقمه من القائمة اللي فاتت";
    }

    lastRoomListRef.current = { hotel, rooms: hotel.rooms };

    const roomsText = hotel.rooms
      .map(
        (r, i) =>
          `${i + 1}. ${r.name.ar} — ${r.sizeSqm} م² — يتسع لـ ${r.maxGuests} — ${r.basePrice} جنيه/الليلة`,
      )
      .join("\n");

    return `${hotel.name.ar} — الغرف المتاحة:\n${roomsText}\n\nاختار رقم الغرفة أو قولّي اسمها`;
  };

  // ── خطوة 3: حل اختيار الغرفة والتنقل لصفحة المراجعة ──
  const handleSelectRoom = (selector: string): string => {
    const { hotel, rooms } = lastRoomListRef.current;
    if (!hotel || rooms.length === 0) {
      return "محتاج تختار فندق الأول قبل ما تختار غرفة 🙂";
    }

    let room: RoomOption | undefined;

    const asNumber = parseInt(selector.trim(), 10);
    if (!isNaN(asNumber) && rooms[asNumber - 1]) {
      room = rooms[asNumber - 1];
    } else {
      room = rooms.find(
        (r) =>
          r.name.ar.includes(selector) ||
          r.name.en.toLowerCase().includes(selector.toLowerCase()),
      );
    }

    if (!room) {
      return "معرفتش أحدد الغرفة دي، جرب تكتب رقمها من القائمة اللي فاتت";
    }

    // نحدّث بيانات البحث في Redux عشان صفحة المراجعة تلاقي التواريخ والضيوف
    const criteria = lastSearchCriteriaRef.current;
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

  useRegisterAiHandlers({
    onRecommendHotels: handleRecommendHotels,
    onSelectHotel: handleSelectHotel,
    onSelectRoom: handleSelectRoom,
  });

  return (
    <div>
      <HeroSection
        tagline={t("tagline")}
        title={t("title")}
        description={t("description")}
        image="/image/hotal_2.jpg"
      />

      <div className="mx-auto my-4 w-[90%]">
        <StaySearchBar onSearch={handleSearch} />
      </div>
      <div className="h-px w-full bg-border mx-auto" />

      <div className="mx-auto my-4 w-[90%]">
        <StayResultsPage
          hotels={mockHotels}
          filters={filters}
          onFiltersChange={setFilters}
          destination={searchData?.destination?.label}
        />
      </div>
      <SignInBanner />
    </div>
  );
}
