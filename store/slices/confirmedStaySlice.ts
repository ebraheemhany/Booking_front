import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { GuestDetails } from "@/component_items/booking/GuestDetailsForm";

interface ConfirmedStayState {
  hotelId: string | null;
  hotelName: string | null;
  hotelImage: string | null;
  hotelStars: number | null;
  roomName: string | null;
  checkIn: string | null;
  checkOut: string | null;
  nights: number | null;
  adults: number | null;
  children: number | null;
  totalPrice: number | null;
  guestDetails: GuestDetails | null;
  bookingRef: string | null;
  confirmedAt: string | null;
}

const initialState: ConfirmedStayState = {
  hotelId: null,
  hotelName: null,
  hotelImage: null,
  hotelStars: null,
  roomName: null,
  checkIn: null,
  checkOut: null,
  nights: null,
  adults: null,
  children: null,
  totalPrice: null,
  guestDetails: null,
  bookingRef: null,
  confirmedAt: null,
};

const confirmedStaySlice = createSlice({
  name: "confirmedStay",
  initialState,
  reducers: {
    setConfirmedStay: (
      state,
      action: PayloadAction<Partial<ConfirmedStayState>>,
    ) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setConfirmedStay } = confirmedStaySlice.actions;
export default confirmedStaySlice.reducer;
