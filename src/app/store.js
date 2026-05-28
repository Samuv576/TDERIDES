import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../store/authSlice';
import userReducer from '../store/userSlice';
import rideReducer from '../store/rideSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    ride: rideReducer,
  },
});
