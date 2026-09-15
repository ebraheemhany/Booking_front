"use client";

import { useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSelector, useDispatch } from "react-redux";
import { differenceInCalendarDays } from "date-fns";
import type { RootState, AppDispatch } from "@/store/store";
import { setConfirmedStay } from "@/store/slices/confirmedStaySlice";
import {
  GuestDetailsForm,
  type GuestDetails,
} from "@/component_items/booking/GuestDetailsForm";
import { MasarBookingSummary } from "@/component_items/booking/MasarBookingSummary";
import { mockHotelDetails } from "@/component_items/hotels/mockHotelDetails";

export default function CheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hotelId = params.id as string;
  const roomId = searchParams.get("roomId");
  const t = useTranslations("Checkout");

  const dispatch = useDispatch<AppDispatch>();
  const staySearch = useSelector((state: RootState) => state.staySearch);
  const hotel = mockHotelDetails.find((h) => h.id === hotelId);

  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+20",
    country: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!hotel) return null;

  const room = hotel.rooms.find((r) => r.id === roomId) ?? hotel.rooms[0];
  const checkIn = staySearch.checkIn ? new Date(staySearch.checkIn) : null;
  const checkOut = staySearch.checkOut ? new Date(staySearch.checkOut) : null;
  const nights =
    checkIn && checkOut ? differenceInCalendarDays(checkOut, checkIn) : 1;
  const totalPrice = room.basePrice * nights;

  const handleConfirm = () => {
    setIsSubmitting(true);

    const bookingRef = `MSR-${Date.now().toString().slice(-8)}`;

    dispatch(
      setConfirmedStay({
        hotelId: hotel.id,
        hotelName: hotel.name.ar, // أو خزّن الاتنين لو محتاج تعدد لغات هنا
        hotelImage: hotel.image,
        hotelStars: hotel.stars,
        roomName: room.name.ar,
        checkIn: staySearch.checkIn,
        checkOut: staySearch.checkOut,
        nights,
        adults: staySearch.adults,
        children: staySearch.children,
        totalPrice,
        guestDetails,
        bookingRef,
        confirmedAt: new Date().toISOString(),
      }),
    );

    router.push(`/feature/stays/${hotel.id}/confirmation`);
  };

  return (
    <div className="mx-auto w-full px-4 py-8 sm:w-[90%] lg:w-[80%]">
      <h1 className="mb-6 text-2xl font-bold text-white sm:text-3xl">
        {t("pageTitle")}
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <GuestDetailsForm value={guestDetails} onChange={setGuestDetails} />

        <div className="lg:sticky lg:top-4 lg:self-start">
          <MasarBookingSummary
            hotel={hotel}
            room={room}
            checkIn={checkIn}
            checkOut={checkOut}
            onConfirm={handleConfirm}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
