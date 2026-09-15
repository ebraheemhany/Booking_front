import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StaySearchState {
  destination: { key: string; label: string } | null;
  checkIn: string | null; // ISO string
  checkOut: string | null;
  adults: number;
  children: number;
}

const initialState: StaySearchState = {
  destination: null,
  checkIn: null,
  checkOut: null,
  adults: 2,
  children: 0,
};

const staySearchSlice = createSlice({
  name: "staySearch",
  initialState,
  reducers: {
    setStaySearchData: (
      state,
      action: PayloadAction<Partial<StaySearchState>>,
    ) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setStaySearchData } = staySearchSlice.actions;
export default staySearchSlice.reducer;
