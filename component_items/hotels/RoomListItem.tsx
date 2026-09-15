"use client";

import { useTranslations, useLocale } from "next-intl";
import { useConvertedPrice } from "@/hooks/useConvertedPrice";
import type { RoomOption } from "./HotelCard";
import { Button } from "@/components/ui/button";

interface RoomListItemProps {
  room: RoomOption;
  isSelected: boolean;
  onSelect: () => void;
}

function PriceOption({
  label,
  price,
  note,
  isSelected,
  onSelect,
}: {
  label: string;
  price: number;
  note: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { formattedPrice, currency, isLoading } = useConvertedPrice(price);

  return (
    <button
      onClick={onSelect}
      className={`flex-1 rounded-xl border p-3 text-start transition-colors ${
        isSelected
          ? "border-amber-500 bg-amber-500/10"
          : "border-white/10 hover:bg-white/5"
      }`}
    >
      <p className="mb-1 text-xs text-white/50">{label}</p>
      <p className="text-lg font-bold text-white">
        {isLoading ? "..." : formattedPrice}
        <span className="ms-1 text-sm font-normal text-white/60">
          {currency}
        </span>
      </p>
      <p className="mt-1 text-[11px] text-white/40">{note}</p>
    </button>
  );
}

export function RoomListItem({
  room,
  isSelected,
  onSelect,
}: RoomListItemProps) {
  const t = useTranslations("Hotels");
  const locale = useLocale() as "ar" | "en";

  return (
    <div
      className={`rounded-2xl border p-4 transition-colors ${
        isSelected ? "border-amber-500/50" : "border-white/10"
      }`}
    >
      <h3 className="mb-1 text-base font-bold text-white">
        {room.name[locale]}
      </h3>
      <p className="mb-3 text-xs text-white/50">
        {t("roomMeta", {
          size: room.sizeSqm,
          bed: room.bedType[locale],
          guests: room.maxGuests,
        })}
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <PriceOption
          label={t("basePriceLabel")}
          price={room.basePrice}
          note={t("payAtCheckIn")}
          isSelected={isSelected}
          onSelect={onSelect}
        />
        {room.breakfastPrice !== null && (
          <PriceOption
            label={t("breakfastPriceLabel")}
            price={room.breakfastPrice}
            note={
              room.freeCancellation
                ? t("freeCancellation")
                : t("noFreeCancellation")
            }
            isSelected={false}
            onSelect={onSelect}
          />
        )}
      </div>

      <div className="mt-3 flex items-center justify-end">
        <Button
          onClick={onSelect}
          variant={isSelected ? "default" : "outline"}
          className={
            isSelected
              ? "bg-amber-500 font-bold text-black hover:bg-amber-400"
              : "border-white/10 bg-transparent text-white hover:bg-white/5"
          }
        >
          {isSelected ? t("selected") : t("select")}
        </Button>
      </div>
    </div>
  );
}
