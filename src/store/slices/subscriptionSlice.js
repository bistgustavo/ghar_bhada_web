import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import subscriptionService from '../../services/subscriptionService';

const initialState = {
  subscriptions: [],
  currentSubscription: null,
  loading: false,
  error: null,
  paymentStatus: null, // to track eSewa verify
};

export const fetchMySubscriptions = createAsyncThunk('subscriptions/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const response = await subscriptionService.getMySubscriptions();
    return response;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch subscriptions');
  }
});

export const initiateSubscription = createAsyncThunk('subscriptions/initiate', async (roomId, { rejectWithValue }) => {
  try {
    const response = await subscriptionService.initiate(roomId);
    return response;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to initiate subscription');
  }
});

export const verifyPayment = createAsyncThunk('subscriptions/verify', async (data, { rejectWithValue }) => {
  try {
    const response = await subscriptionService.verifyPayment(data);
    return response;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to verify payment');
  }
});

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    clearSubscriptionError: (state) => {
      state.error = null;
    },
    resetPaymentStatus: (state) => {
      state.paymentStatus = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMySubscriptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMySubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchMySubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(initiateSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiateSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = action.payload;
      })
      .addCase(initiateSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.paymentStatus = 'verifying';
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = 'success';
        const index = state.subscriptions.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.subscriptions[index] = action.payload;
        }
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.paymentStatus = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearSubscriptionError, resetPaymentStatus } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
