import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../services/api';

/* =========================================================
   TYPES
========================================================= */

/**
 * User data stored in Redux.
 *
 * IMPORTANT:
 * Never store the user's password here.
 */
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  celphone: string;
}

/**
 * User object returned by the API.
 *
 * The server never sends the password field back,
 * so this is now identical to the Redux User shape.
 */
interface ApiUser extends User {}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
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

interface LoginResponse {
  user: User;
  token: string;
}

interface UpdateUserCredentialsData {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface UpdateUserProfileData {
  firstName: string;
  lastName: string;
  celphone: string;
}

/* =========================================================
   CONSTANTS
========================================================= */

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

/**
 * Safely load the logged-in user from localStorage.
 *
 * JSON.parse can throw an error if the stored data
 * has become corrupted, so we protect it with try/catch.
 */
const getStoredUser = (): User | null => {
  try {
    const userString = localStorage.getItem(USER_KEY);

    if (!userString) {
      return null;
    }

    return JSON.parse(userString) as User;
  } catch (error) {
    console.error('Failed to read stored user:', error);

    localStorage.removeItem(USER_KEY);

    return null;
  }
};

/**
 * Load the existing authentication session.
 */
const loadAuthFromStorage = (): AuthState => {
  const token = localStorage.getItem(TOKEN_KEY);
  const user = getStoredUser();

  /**
   * A session is considered valid on the client only when
   * both token and user exist.
   */
  const isAuthenticated = Boolean(token && user);

  /**
   * Clean up incomplete authentication data.
   */
  if (!isAuthenticated) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  return {
    user: isAuthenticated ? user : null,
    token: isAuthenticated ? token : null,
    isAuthenticated,
    loading: false,
    error: null,
  };
};

/**
 * Save authentication information to localStorage.
 */
const saveAuthToStorage = (
  user: User,
  token: string
): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Remove authentication information from localStorage.
 */
const clearAuthFromStorage = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Convert API user data into the safe Redux User type.
 *
 * Ensures no unexpected fields (e.g. a future password field)
 * can leak into Redux state.
 */
const mapApiUserToReduxUser = (
  user: ApiUser
): User => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    celphone: user.celphone,
  };
};

/**
 * Safely extract an error message.
 */
const getErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

/**
 * Make an authenticated fetch call to the backend.
 * Throws an Error with the server's message on non-2xx responses.
 */
const authFetch = async (
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status} ${response.statusText}`;

    try {
      const errorData = await response.json();

      if (errorData && typeof errorData.message === 'string') {
        message = errorData.message;
      }
    } catch {
      // Ignore JSON parsing errors on error responses.
    }

    throw new Error(message);
  }

  return response;
};

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState: AuthState = loadAuthFromStorage();

/* =========================================================
   LOGIN
========================================================= */

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      /* -----------------------------------------------
         Validate input
      ------------------------------------------------ */

      const email = credentials.email.trim().toLowerCase();
      const password = credentials.password;

      if (!email) {
        return rejectWithValue('Email is required');
      }

      if (!password) {
        return rejectWithValue('Password is required');
      }

      /* -----------------------------------------------
         Call backend — server verifies credentials
         and returns a signed JWT
      ------------------------------------------------ */

      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        let message = 'Invalid email or password';

        try {
          const errorData = await response.json();

          if (
            errorData &&
            typeof errorData.message === 'string'
          ) {
            message = errorData.message;
          }
        } catch {
          // Ignore JSON parsing errors on error responses.
        }

        return rejectWithValue(message);
      }

      const data: { token: string; user: ApiUser } =
        await response.json();

      /* -----------------------------------------------
         Remove any unexpected fields before storing
      ------------------------------------------------ */

      const reduxUser = mapApiUserToReduxUser(data.user);

      /* -----------------------------------------------
         Persist session
      ------------------------------------------------ */

      saveAuthToStorage(reduxUser, data.token);

      return {
        user: reduxUser,
        token: data.token,
      };
    } catch (error) {
      console.error('Login failed:', error);

      return rejectWithValue(
        getErrorMessage(
          error,
          'Login failed. Please try again.'
        )
      );
    }
  }
);

/* =========================================================
   REGISTER
========================================================= */

export const registerUser = createAsyncThunk<
  User,
  RegisterData,
  { rejectValue: string }
>(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      /* -----------------------------------------------
         Normalize input
      ------------------------------------------------ */

      const firstName = data.firstName.trim();
      const lastName = data.lastName.trim();
      const email = data.email.trim().toLowerCase();
      const celphone = data.celphone.trim();

      /* -----------------------------------------------
         Validate required fields (client-side)
      ------------------------------------------------ */

      if (!firstName) {
        return rejectWithValue('First name is required');
      }

      if (!lastName) {
        return rejectWithValue('Last name is required');
      }

      if (!email) {
        return rejectWithValue('Email is required');
      }

      if (!celphone) {
        return rejectWithValue('Cellphone number is required');
      }

      if (!data.password) {
        return rejectWithValue('Password is required');
      }

      /* -----------------------------------------------
         Validate password confirmation (client-side only —
         confirmPassword is NOT sent to the server)
      ------------------------------------------------ */

      if (data.password !== data.confirmPassword) {
        return rejectWithValue('Passwords do not match');
      }

      if (data.password.length < 8) {
        return rejectWithValue(
          'Password must be at least 8 characters'
        );
      }

      /* -----------------------------------------------
         Call backend — server hashes the password
         and checks for duplicate emails
      ------------------------------------------------ */

      const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            celphone,
            password: data.password,
          }),
        }
      );

      if (!response.ok) {
        let message = 'Registration failed. Please try again.';

        try {
          const errorData = await response.json();

          if (
            errorData &&
            typeof errorData.message === 'string'
          ) {
            message = errorData.message;
          }
        } catch {
          // Ignore JSON parsing errors on error responses.
        }

        return rejectWithValue(message);
      }

      const newUser: ApiUser = await response.json();

      return mapApiUserToReduxUser(newUser);
    } catch (error) {
      console.error('Registration failed:', error);

      return rejectWithValue(
        getErrorMessage(
          error,
          'Registration failed. Please try again.'
        )
      );
    }
  }
);

/* =========================================================
   UPDATE USER CREDENTIALS
========================================================= */

export const updateUserCredentials = createAsyncThunk<
  User,
  UpdateUserCredentialsData,
  { state: { auth: AuthState }; rejectValue: string }
>(
  'auth/updateUserCredentials',
  async (data, { getState, rejectWithValue }) => {
    try {
      const currentUser = getState().auth.user;
      const currentToken = getState().auth.token;

      if (!currentUser || !currentToken) {
        return rejectWithValue(
          'You must be logged in to update your login details'
        );
      }

      /* -----------------------------------------------
         Validate input (client-side)
      ------------------------------------------------ */

      const email = data.email.trim().toLowerCase();
      const currentPassword = data.currentPassword;
      const newPassword = data.newPassword;
      const confirmNewPassword = data.confirmNewPassword;

      if (!email) {
        return rejectWithValue('Email is required');
      }

      if (!currentPassword) {
        return rejectWithValue('Current password is required');
      }

      if (!newPassword) {
        return rejectWithValue('New password is required');
      }

      if (!confirmNewPassword) {
        return rejectWithValue('Please confirm your new password');
      }

      if (newPassword !== confirmNewPassword) {
        return rejectWithValue('New passwords do not match');
      }

      if (newPassword.length < 8) {
        return rejectWithValue(
          'Password must be at least 8 characters'
        );
      }

      /* -----------------------------------------------
         Call backend — server verifies currentPassword
         with bcrypt and updates email + password hash
      ------------------------------------------------ */

      const response = await authFetch(
        '/auth/me/credentials',
        currentToken,
        {
          method: 'PATCH',
          body: JSON.stringify({
            email,
            currentPassword,
            newPassword,
          }),
        }
      );

      const updatedApiUser: ApiUser = await response.json();
      const updatedUser = mapApiUserToReduxUser(updatedApiUser);

      saveAuthToStorage(updatedUser, currentToken);

      return updatedUser;
    } catch (error) {
      console.error('Failed to update user credentials:', error);

      return rejectWithValue(
        getErrorMessage(
          error,
          'Failed to update login details. Please try again.'
        )
      );
    }
  }
);

/* =========================================================
   UPDATE USER PROFILE
========================================================= */

export const updateUserProfile = createAsyncThunk<
  User,
  UpdateUserProfileData,
  { state: { auth: AuthState }; rejectValue: string }
>(
  'auth/updateUserProfile',
  async (data, { getState, rejectWithValue }) => {
    try {
      const currentUser = getState().auth.user;
      const currentToken = getState().auth.token;

      if (!currentUser || !currentToken) {
        return rejectWithValue(
          'You must be logged in to update your profile'
        );
      }

      /* -----------------------------------------------
         Validate input (client-side)
      ------------------------------------------------ */

      const firstName = data.firstName.trim();
      const lastName = data.lastName.trim();
      const celphone = data.celphone.trim();

      if (!firstName) {
        return rejectWithValue('First name is required');
      }

      if (!lastName) {
        return rejectWithValue('Last name is required');
      }

      if (!celphone) {
        return rejectWithValue('Cellphone number is required');
      }

      /* -----------------------------------------------
         Call backend
      ------------------------------------------------ */

      const response = await authFetch(
        '/auth/me/profile',
        currentToken,
        {
          method: 'PATCH',
          body: JSON.stringify({ firstName, lastName, celphone }),
        }
      );

      const updatedApiUser: ApiUser = await response.json();
      const updatedUser = mapApiUserToReduxUser(updatedApiUser);

      saveAuthToStorage(updatedUser, currentToken);

      return updatedUser;
    } catch (error) {
      console.error('Failed to update user profile:', error);

      return rejectWithValue(
        getErrorMessage(
          error,
          'Failed to update profile. Please try again.'
        )
      );
    }
  }
);

/* =========================================================
   AUTH SLICE
========================================================= */

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    /* -----------------------------------------------
       LOGOUT
    ------------------------------------------------ */

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      clearAuthFromStorage();
    },

    /* -----------------------------------------------
       CLEAR ERROR
    ------------------------------------------------ */

    clearError: (state) => {
      state.error = null;
    },
  },

  /* =====================================================
     ASYNC THUNKS
  ===================================================== */

  extraReducers: (builder) => {
    builder

      /* ===============================================
         LOGIN - PENDING
      =============================================== */

      .addCase(
        loginUser.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      /* ===============================================
         LOGIN - SUCCESS
      =============================================== */

      .addCase(
        loginUser.fulfilled,
        (state, action) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.error = null;
        }
      )

      /* ===============================================
         LOGIN - FAILED
      =============================================== */

      .addCase(
        loginUser.rejected,
        (state, action) => {
          state.loading = false;
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;

          state.error =
            action.payload ??
            'Login failed. Please try again.';
        }
      )

      /* ===============================================
         REGISTER - PENDING
      =============================================== */

      .addCase(
        registerUser.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      /* ===============================================
         REGISTER - SUCCESS
      =============================================== */

      .addCase(
        registerUser.fulfilled,
        (state) => {
          state.loading = false;
          state.error = null;
        }
      )

      /* ===============================================
         REGISTER - FAILED
      =============================================== */

      .addCase(
        registerUser.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ??
            'Registration failed. Please try again.';
        }
      )

      .addCase(
        updateUserCredentials.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        updateUserCredentials.fulfilled,
        (state, action) => {
          state.loading = false;
          state.user = action.payload;
          state.error = null;
        }
      )

      .addCase(
        updateUserCredentials.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ??
            'Failed to update login details. Please try again.';
        }
      )

      .addCase(
        updateUserProfile.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        updateUserProfile.fulfilled,
        (state, action) => {
          state.loading = false;
          state.user = action.payload;
          state.error = null;
        }
      )

      .addCase(
        updateUserProfile.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ??
            'Failed to update profile. Please try again.';
        }
      );
  },
});

/* =========================================================
   ACTIONS
========================================================= */

export const {
  logout,
  clearError,
} = authSlice.actions;

/* =========================================================
   SELECTORS
========================================================= */

export const selectUser = (
  state: { auth: AuthState }
) => state.auth.user;

export const selectToken = (
  state: { auth: AuthState }
) => state.auth.token;

export const selectIsAuthenticated = (
  state: { auth: AuthState }
) => state.auth.isAuthenticated;

export const selectAuthLoading = (
  state: { auth: AuthState }
) => state.auth.loading;

export const selectAuthError = (
  state: { auth: AuthState }
) => state.auth.error;

/* =========================================================
   REDUCER
========================================================= */

export default authSlice.reducer;
