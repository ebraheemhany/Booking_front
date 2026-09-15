import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CarCardData } from "@/component_items/cars/CarCard";
import type { TripType } from "@/component_items/booking/TripDetailsStep";

interface Location {
  address: string;
  lat: number;
  lng: number;
}

interface BookingState {
  source: "lemozeen" | "fastTrack" | null;
  tripType: TripType | null;
  pickup: Location | null;
  dropoff: Location | null;
  date: string | null;
  time: string | null;
  passengers: number | null;
  luggage: number | null;
  selectedCar: CarCardData | null;
}

const initialState: BookingState = {
  source: null,
  tripType: null,
  pickup: null,
  dropoff: null,
  date: null,
  time: null,
  passengers: null,
  luggage: null,
  selectedCar: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingData: (state, action: PayloadAction<Partial<BookingState>>) => {
      return { ...state, ...action.payload };
    },
    clearBookingData: () => initialState,
  },
});

export const { setBookingData, clearBookingData } = bookingSlice.actions;
export default bookingSlice.reducer;
