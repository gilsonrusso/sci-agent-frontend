import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  authApi,
  type LoginRequest,
  type RegisterRequest,
  type User,
} from '../../features/auth/authApi';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('access_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,
  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem('access_token', response.access_token);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Login failed');
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      await authApi.register(data);
      // Automatically login after register
      const response = await authApi.login({ username: data.email, password: data.password });
      localStorage.setItem('access_token', response.access_token);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Registration failed');
    }
  },
);

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const user = await authApi.getMe();
    return user;
  } catch {
    localStorage.removeItem('access_token');
    return rejectWithValue('Session expired');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('access_token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.accessToken = action.payload.access_token;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.accessToken = action.payload.access_token;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Check Auth
    builder.addCase(checkAuth.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(checkAuth.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
