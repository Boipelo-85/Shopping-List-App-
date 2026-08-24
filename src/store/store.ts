// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import listReducer from './listSlice';
import itemsReducer from './itemsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lists: listReducer,
    items: itemsReducer,
  },
});

// 🔑 Export RootState and AppDispatch types

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
