import {createAsyncThunk,createSlice } from '@reduxjs/toolkit';
import { usersApi } from '../services/api';

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
 * The backend/database may contain the password,
 * but we NEVER put it into Redux.
 */
interface ApiUser extends User {
  password: string;
}

interface AuthState {
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
 * This makes sure password data NEVER enters Redux.
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
         Find user through API
      ------------------------------------------------ */

      const user = await usersApi.getByEmail(email) as ApiUser | null;

      if (!user) {
        return rejectWithValue(
          'Invalid email or password'
        );
      }

      /* -----------------------------------------------
         Check password

       
      ------------------------------------------------ */

      if (user.password !== password) {
        return rejectWithValue(
          'Invalid email or password'
        );
      }

      /* -----------------------------------------------
         Create session token

      ------------------------------------------------ */

      const token = btoa(
        `${user.email}:${Date.now()}`
      );

      /* -----------------------------------------------
         Remove password before storing user
      ------------------------------------------------ */

      const reduxUser =
        mapApiUserToReduxUser(user);

      /* -----------------------------------------------
         Persist session
      ------------------------------------------------ */

      saveAuthToStorage(
        reduxUser,
        token
      );

      return {
        user: reduxUser,
        token,
      };
    } catch (error) {
      console.error(
        'Login failed:',
        error
      );

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
  ApiUser,
  RegisterData,
  { rejectValue: string }
>(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      /* -----------------------------------------------
         Normalize input
      ------------------------------------------------ */

      const firstName =
        data.firstName.trim();

      const lastName =
        data.lastName.trim();

      const email =
        data.email.trim().toLowerCase();

      const celphone =
        data.celphone.trim();

      /* -----------------------------------------------
         Validate required fields
      ------------------------------------------------ */

      if (!firstName) {
        return rejectWithValue(
          'First name is required'
        );
      }

      if (!lastName) {
        return rejectWithValue(
          'Last name is required'
        );
      }

      if (!email) {
        return rejectWithValue(
          'Email is required'
        );
      }

      if (!celphone) {
        return rejectWithValue(
          'Cellphone number is required'
        );
      }

      if (!data.password) {
        return rejectWithValue(
          'Password is required'
        );
      }

      /* -----------------------------------------------
         Validate password confirmation
      ------------------------------------------------ */

      if (
        data.password !==
        data.confirmPassword
      ) {
        return rejectWithValue(
          'Passwords do not match'
        );
      }

      /* -----------------------------------------------
         Check password length
      ------------------------------------------------ */

      if (data.password.length < 8) {
        return rejectWithValue(
          'Password must be at least 8 characters'
        );
      }

      /* -----------------------------------------------
         Check whether account already exists
      ------------------------------------------------ */

      const existingUser =
        await usersApi.getByEmail(email);

      if (existingUser) {
        return rejectWithValue(
          'User with this email already exists'
        );
      }

      /* -----------------------------------------------
         Create user through API
      ------------------------------------------------ */

    const newUser = await usersApi.create({
      username: email,
    firstName,
    lastName,
    email,
    celphone,
    password: data.password,
    });

      return newUser as ApiUser;
      
    } catch (error) {
      console.error(
        'Registration failed:',
        error
      );

      return rejectWithValue(
        getErrorMessage(
          error,
          'Registration failed. Please try again.'
        )
      );
    }
  }
);

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

      if (!currentUser) {
        return rejectWithValue('You must be logged in to update your login details');
      }

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
        return rejectWithValue('Password must be at least 8 characters');
      }

      const existingRecord = await usersApi.getById(currentUser.id) as ApiUser | null;

      if (!existingRecord) {
        return rejectWithValue('User account could not be found');
      }

      if (existingRecord.password !== currentPassword) {
        return rejectWithValue('Current password is incorrect');
      }

      const existingUserWithEmail = await usersApi.getByEmail(email);
      if (existingUserWithEmail && existingUserWithEmail.id !== currentUser.id) {
        return rejectWithValue('User with this email already exists');
      }

      const updatedApiUser = await usersApi.update(currentUser.id, {
        email,
        username: email,
        password: newPassword,
      }) as ApiUser;

      const updatedUser = mapApiUserToReduxUser(updatedApiUser);

      if (currentToken) {
        saveAuthToStorage(updatedUser, currentToken);
      }

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

      if (!currentUser) {
        return rejectWithValue('You must be logged in to update your profile');
      }

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

      const updatedApiUser = await usersApi.update(currentUser.id, {
        firstName,
        lastName,
        celphone,
      }) as ApiUser;

      const updatedUser = mapApiUserToReduxUser(updatedApiUser);

      if (currentToken) {
        saveAuthToStorage(updatedUser, currentToken);
      }

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

    /* -----------------------------------------------
       RESTORE SESSION
    ------------------------------------------------ */

   
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