"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { HotelGallery } from "@/component_items/hotels/HotelGallery";
import { HotelDetailsTabs } from "@/component_items/hotels/HotelDetailsTabs";
import { HotelBookingCard } from "@/component_items/hotels/HotelBookingCard";
import { RoomListItem } from "@/component_items/hotels/RoomListItem";
import { mockHotelDetails } from "@/component_items/hotels/mockHotelDetails";

export default function HotelDetailsPage() {
  const params = useParams();
  const hotelId = params.id as string;
  const t = useTranslations("Hotels");
  const locale = useLocale() as "ar" | "en";

  const hotel = mockHotelDetails.find((h) => h.id === hotelId);
  const [activeTab, setActiveTab] = useState<"rooms" | "facilities" | "photos">(
    "rooms",
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  if (!hotel) {
    return (
      <div className="mx-auto w-full px-4 py-16 text-center text-white/60">
        {t("noResults")}
      </div>
    );
  }

  const selectedRoom = hotel.rooms.find((r) => r.id === selectedRoomId);

  return (
    <div className="mx-auto w-full px-4 py-6 sm:w-[92%] lg:w-[85%]">
      <HotelGallery images={hotel.images} hotelName={hotel.name[locale]} />

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <HotelDetailsTabs active={activeTab} onChange={setActiveTab} />

          {activeTab === "rooms" && (
            <div className="mt-4 space-y-4">
              {hotel.rooms.map((room) => (
                <RoomListItem
                  key={room.id}
                  room={room}
                  isSelected={selectedRoomId === room.id}
                  onSelect={() => setSelectedRoomId(room.id)}
                />
              ))}
            </div>
          )}

          {activeTab === "facilities" && (
            <div className="mt-4 flex flex-wrap gap-2">
              {hotel.facilities.map((f) => (
                <span
                  key={f}
                  className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80"
                >
                  {t(`amenity_${f}`)}
                </span>
              ))}
            </div>
          )}

          {activeTab === "photos" && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {hotel.images.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-lg"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${hotel.name[locale]} ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-4 lg:self-start">
          <HotelBookingCard hotel={hotel} selectedRoom={selectedRoom} />
        </div>
      </div>
    </div>
  );
}
