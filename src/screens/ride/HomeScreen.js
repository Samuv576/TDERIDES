import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import MapViewComponent from '../../components/MapViewComponent';
import colors from '../../constants/colors';
import {googleMapsApiKey} from '../../config/googleMaps';
import {
  getCurrentLocation,
  getDirections,
  getDistanceMatrix,
} from '../../services/locationService';
import {setDestination, setOrigin, setTripMetrics} from '../../store/rideSlice';
import {getReadableErrorMessage} from '../../utils/errorMessages';
import {formatDistance, formatDuration} from '../../utils/formatters';

export default function HomeScreen({navigation}) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const {origin, destination, distance, duration} = useSelector(
    state => state.ride,
  );
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [calculatingRoute, setCalculatingRoute] = useState(false);
  const [message, setMessage] = useState('');

  const loadLocation = useCallback(async () => {
    try {
      setLoadingLocation(true);
      setMessage('');
      const currentLocation = await getCurrentLocation();
      dispatch(setOrigin(currentLocation));
    } catch (error) {
      setMessage(getReadableErrorMessage(error));
    } finally {
      setLoadingLocation(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadLocation();
  }, [loadLocation]);

  const calculateRoute = async nextDestination => {
    if (!origin) {
      setMessage('Necesitamos tu ubicación actual antes de elegir un destino.');
      return;
    }

    try {
      setCalculatingRoute(true);
      setMessage('');
      const metrics = await getDistanceMatrix(origin, nextDestination);
      await getDirections(origin, nextDestination);
      dispatch(
        setTripMetrics({
          distance: metrics.distance,
          duration: metrics.duration,
        }),
      );
    } catch (error) {
      setMessage(getReadableErrorMessage(error));
    } finally {
      setCalculatingRoute(false);
    }
  };

  const handleDestinationSelected = async (data, details) => {
    const location = details?.geometry?.location;

    if (!location) {
      setMessage('No se pudo leer la información del destino seleccionado.');
      return;
    }

    const nextDestination = {
      latitude: location.lat,
      longitude: location.lng,
      address: details.formatted_address || data.description,
    };

    dispatch(setDestination(nextDestination));
    await calculateRoute(nextDestination);
  };

  const handleContinue = () => {
    if (!destination || !distance || !duration) {
      setMessage('Selecciona un destino y espera el cálculo de la ruta.');
      return;
    }

    navigation.navigate('VehicleSelection');
  };

  if (loadingLocation && !origin) {
    return <Loading message="Obteniendo tu ubicación actual..." />;
  }

  return (
    <View style={styles.container}>
      <MapViewComponent destination={destination} origin={origin} />

      <View style={[styles.searchPanel, {top: insets.top + 12}]}>
        <Text style={styles.panelTitle}>¿Para dónde vas?</Text>
        <GooglePlacesAutocomplete
          debounce={350}
          enablePoweredByContainer={false}
          fetchDetails
          keyboardShouldPersistTaps="handled"
          onPress={handleDestinationSelected}
          placeholder="Buscar destino"
          query={{
            key: googleMapsApiKey,
            language: 'es-419',
          }}
          styles={{
            container: styles.autocompleteContainer,
            textInput: styles.autocompleteInput,
            listView: styles.autocompleteList,
            row: styles.autocompleteRow,
            description: styles.autocompleteDescription,
          }}
          textInputProps={{
            placeholderTextColor: colors.textMuted,
          }}
        />
      </View>

      <View style={[styles.bottomPanel, {bottom: tabBarHeight + 12}]}>
        {message ? <Text style={styles.error}>{message}</Text> : null}
        {destination && distance && duration ? (
          <View style={styles.metrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Distancia</Text>
              <Text style={styles.metricValue}>{formatDistance(distance)}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Duración</Text>
              <Text style={styles.metricValue}>{formatDuration(duration)}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.hint}>
            Selecciona un destino para calcular la ruta, distancia y duración.
          </Text>
        )}
        {!origin ? (
          <Button
            loading={loadingLocation}
            onPress={loadLocation}
            style={styles.locationButton}
            title="Activar ubicación"
            variant="secondary"
          />
        ) : null}
        <Button
          disabled={!origin}
          loading={calculatingRoute}
          onPress={handleContinue}
          title="Continuar a selección de vehículo"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  autocompleteContainer: {
    flex: 0,
    marginTop: 12,
    zIndex: 10,
  },
  autocompleteDescription: {
    color: colors.text,
  },
  autocompleteInput: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    color: colors.text,
    fontSize: 16,
    height: 52,
    paddingHorizontal: 14,
  },
  autocompleteList: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
  },
  autocompleteRow: {
    backgroundColor: colors.surface,
    paddingVertical: 12,
  },
  bottomPanel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 26,
    borderWidth: 1,
    left: 16,
    padding: 16,
    position: 'absolute',
    right: 16,
  },
  container: {
    flex: 1,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 12,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  locationButton: {
    marginBottom: 10,
  },
  metricItem: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    flex: 1,
    padding: 12,
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  metricValue: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
  },
  metrics: {
    columnGap: 10,
    flexDirection: 'row',
    marginBottom: 14,
  },
  panelTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  searchPanel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    left: 16,
    padding: 16,
    position: 'absolute',
    right: 16,
    zIndex: 10,
  },
});
