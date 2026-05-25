import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import savedRoomService from '../../services/savedRoomService';

const initialState = {
  savedRooms: [], // Will store full room objects for Dashboard
  savedRoomIds: [], // Stores only IDs for quick toggle
  loading: false,
  error: null,
};

export const fetchSavedRooms = createAsyncThunk('savedRooms/fetch', async (params, { rejectWithValue }) => {
  try {
    const response = await savedRoomService.getSavedRooms(params);
    return response;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch saved rooms');
  }
});

export const toggleSaveRoom = createAsyncThunk('savedRooms/toggle', async ({ roomId, isSaved }, { rejectWithValue }) => {
  try {
    if (isSaved) {
      await savedRoomService.unsaveRoom(roomId);
      return { roomId, saved: false };
    } else {
      await savedRoomService.saveRoom(roomId);
      return { roomId, saved: true };
    }
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to toggle saved room');
  }
});

export const checkSavedRoom = createAsyncThunk('savedRooms/check', async (roomId, { rejectWithValue }) => {
  try {
    const response = await savedRoomService.checkSaved(roomId);
    return { roomId, saved: response.is_saved };
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to check saved room');
  }
});

const savedRoomSlice = createSlice({
  name: 'savedRooms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSavedRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.savedRooms = action.payload.items || action.payload;
        // Optionally update savedRoomIds based on fetched rooms
        state.savedRoomIds = state.savedRooms.map(item => item.room_id || item.id);
      })
      .addCase(fetchSavedRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleSaveRoom.fulfilled, (state, action) => {
        if (action.payload.saved) {
          if (!state.savedRoomIds.includes(action.payload.roomId)) {
            state.savedRoomIds.push(action.payload.roomId);
          }
        } else {
          state.savedRoomIds = state.savedRoomIds.filter(id => id !== action.payload.roomId);
          state.savedRooms = state.savedRooms.filter(item => (item.room_id || item.id) !== action.payload.roomId);
        }
      })
      .addCase(checkSavedRoom.fulfilled, (state, action) => {
        if (action.payload.saved) {
          if (!state.savedRoomIds.includes(action.payload.roomId)) {
            state.savedRoomIds.push(action.payload.roomId);
          }
        } else {
          state.savedRoomIds = state.savedRoomIds.filter(id => id !== action.payload.roomId);
        }
      });
  }
});

export default savedRoomSlice.reducer;
