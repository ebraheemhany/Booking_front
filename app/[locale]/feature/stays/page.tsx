"use client";
import { HeroSection } from "@/component_items/Hero_page_Section";

import {
  StaySearchBar,
  type StaySearchData,
} from "@/component_items/StaySearch/StaySearchBar";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { StayResultsPage } from "@/component_items/hotels/StayResultsPage";
import type { HotelFiltersState } from "@/component_items/hotels/HotelFiltersSheet";
import type { HotelCardData } from "@/component_items/hotels/HotelCard";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { setStaySearchData } from "@/store/slices/staySearchSlice";
const mockHotels: HotelCardData[] = [
  {
    specs: {
      id: "1",
      name: { ar: "فندق النيل الذهبي", en: "Golden Nile Hotel" },
      location: { ar: "القاهرة", en: "Cairo" },
      roomType: "hotel",
      stars: 4,
      image: "/image/hotels/hotel1.jpg",
      amenities: [
        "luggageRoom",
        "liftAccess",
        "breakfast",
        "reception24",
        "hotelSafe",
      ],
      pricePerNight: 2200,
    },
  },
  {
    specs: {
      id: "2",
      name: { ar: "شاليه الساحل", en: "Coast Chalet" },
      location: { ar: "الساحل الشمالي", en: "North Coast" },
      roomType: "chalet",
      stars: 5,
      image: "/image/hotels/hotel2.jpg",
      amenities: ["liftAccess", "restaurant"],
      pricePerNight: 3500,
    },
  },
  {
    specs: {
      id: "3",
      name: { ar: "منتجع البحر الأحمر", en: "Red Sea Resort" },
      location: { ar: "الغردقة", en: "Hurghada" },
      roomType: "resort",
      stars: 5,
      image: "/image/hotels/hotel3.jpg",
      amenities: ["swimmingPool", "beachfront", "breakfast", "wifi", "spa"],
      pricePerNight: 4800,
    },
  },
  {
    specs: {
      id: "4",
      name: { ar: "أجنحة الأهرامات الملكية", en: "Pyramids Royal Suites" },
      location: { ar: "الجيزة", en: "Giza" },
      roomType: "hotel",
      stars: 4,
      image: "/image/hotels/hotel4.jpg",
      amenities: ["freeParking", "airportShuttle", "reception24", "breakfast"],
      pricePerNight: 1950,
    },
  },
  {
    specs: {
      id: "5",
      name: { ar: "نزل أصيلة النوبي", en: "Asala Nubian Lodge" },
      location: { ar: "أسوان", en: "Aswan" },
      roomType: "hotel",
      stars: 3,
      image: "/image/hotels/hotel5.jpg",
      amenities: ["riverView", "breakfast", "restaurant", "airConditioning"],
      pricePerNight: 1200,
    },
  },
  {
    specs: {
      id: "6",
      name: { ar: "فندق البوسيت الشاطئي", en: "Beau Site Beach Hotel" },
      location: { ar: "مرسى مطروح", en: "Marsa Matrouh" },
      roomType: "hotel",
      stars: 4,
      image: "/image/hotels/hotel6.jpg",
      amenities: ["beachfront", "swimmingPool", "liftAccess", "restaurant"],
      pricePerNight: 2800,
    },
  },
  {
    specs: {
      id: "7",
      name: { ar: "كامب سحر دهب", en: "Dahab Magic Camp" },
      location: { ar: "دهب", en: "Dahab" },
      roomType: "hotel",
      stars: 3,
      image: "/image/hotels/hotel7.jpg",
      amenities: ["wifi", "petFriendly", "beachfront"],
      pricePerNight: 850,
    },
  },
];

export default function StaysPage() {
  const t = useTranslations("HeroStays");
  const [searchData, setSearchData] = useState<StaySearchData | null>(null);

  const [filters, setFilters] = useState<HotelFiltersState>({
    minStars: null,
    roomType: "all",
    amenities: [],
    minBudget: 500,
    maxBudget: 10000,
  });

  const dispatch = useDispatch<AppDispatch>();

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

  const handleApplyFilters = (values: Record<string, any>) => {
    console.log(values);
    // مثال: { stars: [5, 4], stayType: ["chalet"], managedByEzRent: true }
    // من هنا تبعتها للـ API أو تخليها جزء من نفس فلترة البحث (searchData)
  };

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
      <div className="h-[1px] w-full bg-border mx-auto" />
      <div className="mx-auto my-4 w-[90%]">
        <StayResultsPage
          hotels={mockHotels}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>
    </div>
  );
}
