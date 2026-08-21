// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
// import other slices here if you have them

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // items: itemsReducer,
    // lists: listReducer,
  },
});

// 🔑 Export RootState and AppDispatch types

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
