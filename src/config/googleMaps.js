import {GOOGLE_MAPS_API_KEY} from '@env';

export const googleMapsApiKey = GOOGLE_MAPS_API_KEY;

export const googleApiEndpoints = {
  directions: 'https://maps.googleapis.com/maps/api/directions/json',
  distanceMatrix: 'https://maps.googleapis.com/maps/api/distancematrix/json',
  geocode: 'https://maps.googleapis.com/maps/api/geocode/json',
};
