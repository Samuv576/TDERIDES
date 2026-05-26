import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  selectedLanguage: 'Spanish',
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
      state.selectedLanguage =
        action.payload?.language || state.selectedLanguage;
      state.loading = false;
      state.error = null;
    },
    updateProfileState: (state, action) => {
      state.profile = {
        ...state.profile,
        ...action.payload,
      };
      state.selectedLanguage =
        action.payload.language || state.selectedLanguage;
      state.loading = false;
      state.error = null;
    },
    setSelectedLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
    setUserLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUserError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearProfile: state => {
      state.profile = null;
      state.selectedLanguage = 'Spanish';
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setProfile,
  updateProfileState,
  setSelectedLanguage,
  setUserLoading,
  setUserError,
  clearProfile,
} = userSlice.actions;

export default userSlice.reducer;
