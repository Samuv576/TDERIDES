import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  origin: null,
  destination: null,
  distance: null,
  duration: null,
  selectedVehicle: null,
  estimatedFare: null,
  rideStatus: null,
  currentRide: null,
  driverLocation: null,
  loading: false,
  error: null,
};

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setTripMetrics: (state, action) => {
      state.distance = action.payload.distance;
      state.duration = action.payload.duration;
    },
    setSelectedVehicle: (state, action) => {
      state.selectedVehicle = action.payload;
    },
    setEstimatedFare: (state, action) => {
      state.estimatedFare = action.payload;
    },
    setRideStatus: (state, action) => {
      state.rideStatus = action.payload;
      if (state.currentRide) {
        state.currentRide.status = action.payload;
      }
    },
    setCurrentRide: (state, action) => {
      state.currentRide = action.payload;
      state.rideStatus = action.payload?.status || state.rideStatus;
    },
    setDriverLocation: (state, action) => {
      state.driverLocation = action.payload;
    },
    setRideLoading: (state, action) => {
      state.loading = action.payload;
    },
    setRideError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetRide: state => {
      state.origin = null;
      state.destination = null;
      state.distance = null;
      state.duration = null;
      state.selectedVehicle = null;
      state.estimatedFare = null;
      state.rideStatus = null;
      state.currentRide = null;
      state.driverLocation = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setOrigin,
  setDestination,
  setTripMetrics,
  setSelectedVehicle,
  setEstimatedFare,
  setRideStatus,
  setCurrentRide,
  setDriverLocation,
  setRideLoading,
  setRideError,
  resetRide,
} = rideSlice.actions;

export default rideSlice.reducer;
