import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {googleApiEndpoints, googleMapsApiKey} from '../config/googleMaps';

export const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const status = await Geolocation.requestAuthorization('whenInUse');
    return status === 'granted';
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  return status === PermissionsAndroid.RESULTS.GRANTED;
};

export const getCurrentLocation = async () => {
  const hasPermission = await requestLocationPermission();

  if (!hasPermission) {
    throw new Error('No se concedió el permiso de ubicación.');
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: 'Ubicación actual',
        });
      },
      error =>
        reject(
          new Error(error.message || 'No se pudo obtener tu ubicación actual.'),
        ),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  });
};

export const getDistanceMatrix = async (origin, destination) => {
  const originParam = `${origin.latitude},${origin.longitude}`;
  const destinationParam = `${destination.latitude},${destination.longitude}`;
  const url = `${googleApiEndpoints.distanceMatrix}?origins=${originParam}&destinations=${destinationParam}&units=metric&key=${googleMapsApiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK' || data.rows?.[0]?.elements?.[0]?.status !== 'OK') {
    throw new Error('No se pudo calcular la distancia y la duración.');
  }

  const element = data.rows[0].elements[0];

  return {
    distance: element.distance.value / 1000,
    duration: element.duration.value / 60,
    distanceText: element.distance.text,
    durationText: element.duration.text,
  };
};

export const getDirections = async (origin, destination) => {
  const originParam = `${origin.latitude},${origin.longitude}`;
  const destinationParam = `${destination.latitude},${destination.longitude}`;
  const url = `${googleApiEndpoints.directions}?origin=${originParam}&destination=${destinationParam}&key=${googleMapsApiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK') {
    throw new Error('No se pudo calcular la ruta.');
  }

  return data.routes[0];
};