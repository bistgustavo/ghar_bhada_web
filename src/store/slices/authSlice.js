import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';

// Initialize from localStorage if available
const persistedToken = localStorage.getItem('token');
const persistedUser = localStorage.getItem('user');

let initialUser = null;
if (persistedUser) {
  try {
    initialUser = JSON.parse(persistedUser);
  } catch (e) {
    localStorage.removeItem('user');
  }
}

const initialState = {
  user: initialUser,
  token: persistedToken,
  loading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await userService.loginJson(email, password);
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  } catch (error) {
    return rejectWithValue(error.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async ({ name, email, password, role, avatar }, { rejectWithValue }) => {
  try {
    const response = await userService.register(name, email, password, role, avatar);
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  } catch (error) {
    return rejectWithValue(error.message || 'Registration failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, updateUser, clearError } = authSlice.actions;

export default authSlice.reducer;
