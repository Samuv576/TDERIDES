import React, {useEffect, useMemo, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import colors from '../constants/colors';
import {googleMapsApiKey} from '../config/googleMaps';

const defaultRegion = {
  latitude: 4.711,
  longitude: -74.0721,
  latitudeDelta: 0.06,
  longitudeDelta: 0.06,
};

const getValidCoordinate = coordinate => {
  const latitude = Number(coordinate?.latitude);
  const longitude = Number(coordinate?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
};

export default function MapViewComponent({
  origin,
  destination,
  driverCoordinate,
  showRoute = true,
  onRouteReady,
  style,
}) {
  const mapRef = useRef(null);
  const originCoordinate = getValidCoordinate(origin);
  const destinationCoordinate = getValidCoordinate(destination);
  const driverMarkerCoordinate = getValidCoordinate(driverCoordinate);

  const initialRegion = useMemo(() => {
    const point =
      originCoordinate || destinationCoordinate || driverMarkerCoordinate;

    if (!point) {
      return defaultRegion;
    }

    return {
      latitude: point.latitude,
      longitude: point.longitude,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    };
  }, [destinationCoordinate, driverMarkerCoordinate, originCoordinate]);

  useEffect(() => {
    const coordinates = [
      originCoordinate,
      destinationCoordinate,
      driverMarkerCoordinate,
    ].filter(Boolean);

    if (coordinates.length > 1 && mapRef.current) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {
          top: 90,
          right: 60,
          bottom: 90,
          left: 60,
        },
        animated: true,
      });
    }
  }, [destinationCoordinate, driverMarkerCoordinate, originCoordinate]);

  return (
    <MapView
      ref={mapRef}
      initialRegion={initialRegion}
      provider={PROVIDER_GOOGLE}
      showsUserLocation
      style={[styles.map, style]}>
      {originCoordinate ? (
        <Marker coordinate={originCoordinate} title="Origen">
          <View style={styles.userMarker}>
            <View style={styles.userMarkerDot} />
          </View>
        </Marker>
      ) : null}
      {destinationCoordinate ? (
        <Marker coordinate={destinationCoordinate} title="Destino">
          <View style={styles.destinationMarker}>
            <Text style={styles.destinationMarkerText}>📍</Text>
          </View>
        </Marker>
      ) : null}
      {driverMarkerCoordinate ? (
        <Marker coordinate={driverMarkerCoordinate} title="Conductor">
          <View style={styles.driverMarker}>
            <Text style={styles.driverMarkerText}>🚗</Text>
          </View>
        </Marker>
      ) : null}
      {showRoute && originCoordinate && destinationCoordinate ? (
        <MapViewDirections
          apikey={googleMapsApiKey}
          destination={destinationCoordinate}
          origin={originCoordinate}
          strokeColor={colors.mapRoute}
          strokeWidth={4}
          onReady={onRouteReady}
        />
      ) : null}
    </MapView>
  );
}

const styles = StyleSheet.create({
  destinationMarker: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderColor: colors.surface,
    borderRadius: 18,
    borderWidth: 3,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  destinationMarkerText: {
    color: colors.surface,
    fontSize: 18,
  },
  driverMarker: {
    alignItems: 'center',
    backgroundColor: colors.driver,
    borderColor: colors.surface,
    borderRadius: 20,
    borderWidth: 3,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  driverMarkerText: {
    color: colors.primary,
    fontSize: 18,
  },
  map: {
    flex: 1,
  },
  userMarker: {
    alignItems: 'center',
    backgroundColor: 'rgba(23, 32, 42, 0.16)',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  userMarkerDot: {
    backgroundColor: colors.primary,
    borderColor: colors.surface,
    borderRadius: 9,
    borderWidth: 3,
    height: 18,
    width: 18,
  },
});