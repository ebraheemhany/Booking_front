import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import bookingReducer from "./slices/bookingSlice";
import staySearchReducer from "./slices/staySearchSlice";
import confirmedStayReducer from "./slices/confirmedStaySlice";
const rootReducer = combineReducers({
  booking: bookingReducer,
  staySearch: staySearchReducer,
  confirmedStay: confirmedStayReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["booking", "staySearch", "confirmedStay"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
