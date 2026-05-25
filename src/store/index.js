import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import roomsReducer from './slices/roomsSlice';
import subscriptionsReducer from './slices/subscriptionSlice';
import connectionsReducer from './slices/connectionSlice';
import savedRoomsReducer from './slices/savedRoomSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomsReducer,
    subscriptions: subscriptionsReducer,
    connections: connectionsReducer,
    savedRooms: savedRoomsReducer,
  },
});
