import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventReducer from './slices/eventSlice';
import orderReducer from './slices/orderSlice';
import eventRequestReducer from './slices/eventRequestSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    orders: orderReducer,
    eventRequests: eventRequestReducer,
  },
}); 