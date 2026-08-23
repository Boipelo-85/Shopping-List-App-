// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface User {

  username: string;
  email: string;
  firstName: string;
  lastName: string;
  celphone: string;

}

interface AuthState {

  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

}

const loadAuthFromStorage = (): AuthState => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  return {

    user,
    token,
    isAuthenticated: !!token,
    loading: false,
    error: null,

  };
};

const initialState: AuthState = loadAuthFromStorage();

interface LoginCredentials {

  username: string;
  password: string;

}

interface RegisterData {

  firstName: string;
  lastName: string;
  email: string;
  celphone: string;
  password: string;
  confirmPassword: string;

}

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {

      // Simulate API call - in real app, this would be a backend request
      // For now, we'll use localStorage to simulate user database

      const usersStr = localStorage.getItem('users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      const user = users.find(
        (u: any) => u.username === credentials.username && u.password === credentials.password
      );
      
      if (!user) {
        return rejectWithValue('Invalid username or password');
      }
      
      // Generate a simple token (in real app, this would come from backend)
      const token = btoa(`${user.username}:${Date.now()}`);
      
      // Store token and user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, token };
    } catch (error) {

      return rejectWithValue('Login failed. Please try again.');

    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        return rejectWithValue('Passwords do not match');
      }
      
      // Simulate API call - check if user already exists
      const usersStr = localStorage.getItem('users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      // Check if username or email already exists
      const existingUser = users.find(
        (u: any) => u.username === data.email || u.email === data.email
      );
      
      if (existingUser) {
        return rejectWithValue('User with this email already exists');
      }
      
      // Create new user (using email as username for login)
      const newUser = {
        username: data.email,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        celphone: data.celphone,
        password: data.password,
      };
      
      // Save to localStorage (simulating database)
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      return newUser;
    } catch (error) {
      
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
