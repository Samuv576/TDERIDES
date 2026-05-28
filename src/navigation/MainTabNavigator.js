import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import HomeScreen from '../screens/ride/HomeScreen';
import VehicleSelectionScreen from '../screens/ride/VehicleSelectionScreen';
import RideTrackingScreen from '../screens/ride/RideTrackingScreen';
import PaymentScreen from '../screens/ride/PaymentScreen';
import RideHistoryScreen from '../screens/history/RideHistoryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import colors from '../constants/colors';
import useTranslation from '../hooks/useTranslation';

const Tab = createBottomTabNavigator();
const RideStack = createNativeStackNavigator();

function RideStackNavigator() {
  const {t} = useTranslation();

  return (
    <RideStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: '800',
        },
      }}>
      <RideStack.Screen
        component={HomeScreen}
        name="RideHome"
        options={{title: t('navigation.requestRide')}}
      />
      <RideStack.Screen
        component={VehicleSelectionScreen}
        name="VehicleSelection"
        options={{title: t('navigation.chooseVehicle')}}
      />
      <RideStack.Screen
        component={RideTrackingScreen}
        name="RideTracking"
        options={{title: t('navigation.tracking')}}
      />
      <RideStack.Screen
        component={PaymentScreen}
        name="Payment"
        options={{title: t('navigation.payment')}}
      />
    </RideStack.Navigator>
  );
}

const tabIcon =
  label =>
  ({focused}) =>
    (
      <Text
        style={[
          styles.tabIcon,
          focused ? styles.activeIcon : styles.inactiveIcon,
        ]}>
        {label}
      </Text>
    );

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 66 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
        },
      }}>
      <Tab.Screen
        component={RideStackNavigator}
        name="Home"
        options={{tabBarIcon: tabIcon('🚗'), tabBarLabel: t('navigation.ride')}}
      />
      <Tab.Screen
        component={RideHistoryScreen}
        name="History"
        options={{
          tabBarIcon: tabIcon('🧾'),
          tabBarLabel: t('navigation.history'),
        }}
      />
      <Tab.Screen
        component={ProfileScreen}
        name="Profile"
        options={{
          tabBarIcon: tabIcon('👤'),
          tabBarLabel: t('navigation.profile'),
        }}
      />
      <Tab.Screen
        component={SettingsScreen}
        name="Settings"
        options={{
          tabBarIcon: tabIcon('⚙️'),
          tabBarLabel: t('navigation.settings'),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  activeIcon: {
    color: colors.primary,
    opacity: 1,
  },
  inactiveIcon: {
    color: colors.textMuted,
    opacity: 0.55,
  },
  tabIcon: {
    fontSize: 22,
  },
});
