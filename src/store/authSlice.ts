// src/store/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  username: string;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  username: '',
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ username: string; token: string }>) => {
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.username = '';
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess , logout } = authSlice.actions; // ✅ makes login available
export default authSlice.reducer;
