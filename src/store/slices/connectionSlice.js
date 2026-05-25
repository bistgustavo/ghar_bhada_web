import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import connectionService from '../../services/connectionService';

const initialState = {
  connections: [],
  currentConnection: null,
  loading: false,
  error: null,
};

export const fetchTenantConnections = createAsyncThunk('connections/fetchTenant', async (_, { rejectWithValue }) => {
  try {
    const response = await connectionService.getTenantConnections();
    return response;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch connections');
  }
});

export const fetchLandlordConnections = createAsyncThunk('connections/fetchLandlord', async (_, { rejectWithValue }) => {
  try {
    const response = await connectionService.getLandlordConnections();
    return response;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch connections');
  }
});

export const updateConnectionStatus = createAsyncThunk('connections/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await connectionService.updateConnectionStatus(id, status);
    return response;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to update connection status');
  }
});

const connectionSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenantConnections.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTenantConnections.fulfilled, (state, action) => {
        state.loading = false;
        state.connections = action.payload;
      })
      .addCase(fetchTenantConnections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLandlordConnections.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLandlordConnections.fulfilled, (state, action) => {
        state.loading = false;
        state.connections = action.payload;
      })
      .addCase(fetchLandlordConnections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateConnectionStatus.fulfilled, (state, action) => {
        const index = state.connections.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.connections[index] = action.payload;
        }
      });
  }
});

export default connectionSlice.reducer;
