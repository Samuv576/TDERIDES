import React, {useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/Button';
import VehicleCard from '../../components/VehicleCard';
import colors from '../../constants/colors';
import {vehicleCategories} from '../../constants/vehicles';
import {createRide} from '../../services/rideService';
import {
  setCurrentRide,
  setEstimatedFare,
  setRideError,
  setRideLoading,
  setSelectedVehicle,
} from '../../store/rideSlice';
import globalStyles from '../../styles/globalStyles';
import {getReadableErrorMessage} from '../../utils/errorMessages';
import {calculateFare} from '../../utils/fareCalculator';
import {formatDistance, formatDuration} from '../../utils/formatters';

export default function VehicleSelectionScreen({navigation}) {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const {
    origin,
    destination,
    distance,
    duration,
    selectedVehicle,
    estimatedFare,
    loading,
  } = useSelector(state => state.ride);
  const [message, setMessage] = useState('');

  const fares = useMemo(() => {
    return vehicleCategories.reduce((accumulator, vehicle) => {
      accumulator[vehicle.id] = calculateFare(distance, duration, vehicle.id);
      return accumulator;
    }, {});
  }, [distance, duration]);

  const handleSelectVehicle = vehicle => {
    const fare = fares[vehicle.id];
    dispatch(setSelectedVehicle(vehicle.id));
    dispatch(setEstimatedFare(fare));
    setMessage('');
  };

  const handleRequestRide = async () => {
    if (
      !user?.uid ||
      !origin ||
      !destination ||
      !selectedVehicle ||
      !estimatedFare
    ) {
      setMessage(
        'Elige una categoría de vehículo antes de solicitar el viaje.',
      );
      return;
    }

    try {
      setMessage('');
      dispatch(setRideLoading(true));
      const ride = await createRide({
        userId: user.uid,
        origin,
        destination,
        vehicleCategory: selectedVehicle,
        distanceKm: distance,
        durationMin: duration,
        estimatedFare,
        status: 'Driver assigned',
      });

      dispatch(setCurrentRide(ride));
      navigation.navigate('RideTracking');
    } catch (error) {
      const readableError = getReadableErrorMessage(error);
      setMessage(readableError);
      dispatch(setRideError(readableError));
    } finally {
      dispatch(setRideLoading(false));
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={globalStyles.screen}>
      <ScrollView
        contentContainerStyle={globalStyles.scrollContent}
        style={globalStyles.screen}>
        <Text style={globalStyles.title}>Elige tu vehículo</Text>
        <Text style={globalStyles.subtitle}>
          Selecciona una categoría y revisa la tarifa estimada antes de
          solicitar.
        </Text>

        <View style={[globalStyles.card, styles.tripCard]}>
          <View style={styles.tripRow}>
            <Text style={styles.tripLabel}>Destino</Text>
            <Text style={styles.tripValue}>
              {destination?.address || 'Sin destino seleccionado'}
            </Text>
          </View>
          <View style={styles.metrics}>
            <Text style={styles.metric}>{formatDistance(distance)}</Text>
            <Text style={styles.metric}>{formatDuration(duration)}</Text>
          </View>
        </View>

        <View style={styles.vehicleList}>
          {vehicleCategories.map(vehicle => (
            <VehicleCard
              fare={fares[vehicle.id]}
              key={vehicle.id}
              onPress={() => handleSelectVehicle(vehicle)}
              selected={selectedVehicle === vehicle.id}
              vehicle={vehicle}
            />
          ))}
        </View>

        {message ? <Text style={styles.error}>{message}</Text> : null}
        <Button
          loading={loading}
          onPress={handleRequestRide}
          title="Solicitar viaje"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 14,
  },
  metric: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  metrics: {
    columnGap: 8,
    flexDirection: 'row',
    marginTop: 14,
  },
  tripCard: {
    marginTop: 22,
  },
  tripLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  tripRow: {
    marginBottom: 2,
  },
  tripValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  vehicleList: {
    marginTop: 18,
  },
});
