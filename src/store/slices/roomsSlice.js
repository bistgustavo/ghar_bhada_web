import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import roomService from '../../services/roomService';

const initialState = {
  rooms: [],
  currentRoom: null,
  total: 0,
  loading: false,
  error: null,
  filters: {
    city: '',
    district: '',
    room_type: '',
    min_price: '',
    max_price: ''
  }
};

export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async (filters, { rejectWithValue }) => {
  try {
    const response = await roomService.listRooms(filters);
    return response;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch rooms');
  }
});

export const fetchRoomById = createAsyncThunk('rooms/fetchRoomById', async (id, { rejectWithValue }) => {
  try {
    const response = await roomService.getRoomById(id);
    return response;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch room');
  }
});

export const createRoom = createAsyncThunk('rooms/createRoom', async (data, { rejectWithValue }) => {
  try {
    const response = await roomService.createRoom(data);
    return response;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to create room');
  }
});

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentRoom: (state) => {
      state.currentRoom = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchRooms
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload.rooms || action.payload; // Fallback if backend structure differs
        state.total = action.payload.total || action.payload.length;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchRoomById
      .addCase(fetchRoomById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoom = action.payload;
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createRoom
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms.unshift(action.payload);
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, clearFilters, clearCurrentRoom } = roomsSlice.actions;
export default roomsSlice.reducer;
