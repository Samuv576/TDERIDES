import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import Loading from '../components/Loading';
import colors from '../constants/colors';
import {
  clearAuthUser,
  setAuthError,
  setAuthLoading,
  setAuthUser,
} from '../store/authSlice';
import {
  clearProfile,
  setProfile,
  setSelectedLanguage,
} from '../store/userSlice';
import {resetRide} from '../store/rideSlice';
import {listenToAuthChanges} from '../services/authService';
import {getUserProfile} from '../services/userService';
import {getReadableErrorMessage} from '../utils/errorMessages';

export default function AppNavigator() {
  const dispatch = useDispatch();
  const {isAuthenticated, loading} = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(setAuthLoading(true));

    const unsubscribe = listenToAuthChanges(async firebaseUser => {
      if (!firebaseUser) {
        dispatch(clearAuthUser());
        dispatch(clearProfile());
        dispatch(resetRide());
        return;
      }

      try {
        dispatch(
          setAuthUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          }),
        );

        const profile = await getUserProfile(firebaseUser.uid);

        if (profile) {
          dispatch(setProfile(profile));
          dispatch(setSelectedLanguage(profile.language || 'Spanish'));
        }
      } catch (error) {
        dispatch(setAuthError(getReadableErrorMessage(error)));
      }
    });

    return unsubscribe;
  }, [dispatch]);

  if (loading) {
    return <Loading message="Preparando TDERIDES..." />;
  }

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      {isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
