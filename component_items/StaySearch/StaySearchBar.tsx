"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DestinationPicker, type DestinationValue } from "./DestinationPicker";
import { DateRangePicker, type DateRangeValue } from "./DateRangePicker";
import { GuestsPicker, type GuestsValue } from "./GuestsPicker";

export interface StaySearchData {
  destination: DestinationValue | null;
  dates: DateRangeValue;
  guests: GuestsValue;
}

interface StaySearchBarProps {
  onSearch: (data: StaySearchData) => void;
}

export function StaySearchBar({ onSearch }: StaySearchBarProps) {
  const t = useTranslations("StaySearch");

  const [destination, setDestination] = useState<DestinationValue | null>(null);
  const [dates, setDates] = useState<DateRangeValue>({
    checkIn: null,
    checkOut: null,
  });
  const [guests, setGuests] = useState<GuestsValue>({
    adults: 2,
    children: 0,
  });

  const handleSearchClick = () => {
    onSearch({ destination, dates, guests });
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#0d1728] shadow-xl">
      <div className="flex w-full flex-col divide-y divide-white/10 md:flex-row md:divide-x md:divide-y-0 md:divide-x-reverse">
        <DestinationPicker value={destination} onChange={setDestination} />
        <DateRangePicker value={dates} onChange={setDates} />
        <GuestsPicker value={guests} onChange={setGuests} />

        <div className="flex shrink-0 items-center bg-amber-500 px-6 py-4 transition-colors hover:bg-amber-400 md:w-35">
          <Button
            variant="ghost"
            onClick={handleSearchClick}
            className="h-auto w-full gap-2 p-0 text-sm font-bold text-black hover:bg-transparent"
          >
            <Search className="h-4 w-4" />
            {t("search")}
          </Button>
        </div>
      </div>
    </div>
  );
}
