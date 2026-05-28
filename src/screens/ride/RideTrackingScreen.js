import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/Button';
import MapViewComponent from '../../components/MapViewComponent';
import colors from '../../constants/colors';
import {updateRideStatus} from '../../services/rideService';
import {setDriverLocation, setRideStatus} from '../../store/rideSlice';
import {
  formatCurrency,
  formatDistance,
  formatDuration,
  formatRideStatus,
} from '../../utils/formatters';

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

const interpolateCoordinate = (start, end, progress) => ({
  latitude: start.latitude + (end.latitude - start.latitude) * progress,
  longitude: start.longitude + (end.longitude - start.longitude) * progress,
});

export default function RideTrackingScreen({navigation}) {
  const dispatch = useDispatch();
  const tabBarHeight = useBottomTabBarHeight();
  const {origin, destination, currentRide, rideStatus} = useSelector(
    state => state.ride,
  );
  const originCoordinate = useMemo(() => getValidCoordinate(origin), [origin]);
  const destinationCoordinate = useMemo(
    () => getValidCoordinate(destination),
    [destination],
  );
  const initialDriver = useMemo(() => {
    const base = originCoordinate || {
      latitude: 4.711,
      longitude: -74.0721,
    };

    return {
      latitude: base.latitude - 0.012,
      longitude: base.longitude - 0.012,
    };
  }, [originCoordinate]);
  const [driverCoordinate, setDriverCoordinate] = useState(initialDriver);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    setDriverCoordinate(initialDriver);
  }, [initialDriver]);

  useEffect(() => {
    if (!originCoordinate || !destinationCoordinate || !currentRide?.id) {
      return undefined;
    }

    const start = {
      latitude: originCoordinate.latitude - 0.012,
      longitude: originCoordinate.longitude - 0.012,
    };
    const approachSteps = 10;
    const rideSteps = 12;
    let step = 0;

    setDriverCoordinate(start);
    dispatch(setDriverLocation(start));
    dispatch(setRideStatus('Driver assigned'));
    updateRideStatus(currentRide.id, 'Driver assigned').catch(() => undefined);

    const interval = setInterval(() => {
      step += 1;

      if (step === 3) {
        dispatch(setRideStatus('Driver arriving'));
        updateRideStatus(currentRide.id, 'Driver arriving').catch(
          () => undefined,
        );
      }

      if (step === approachSteps) {
        dispatch(setRideStatus('In progress'));
        updateRideStatus(currentRide.id, 'In progress').catch(() => undefined);
      }

      if (step <= approachSteps) {
        const progress = step / approachSteps;
        const nextCoordinate = interpolateCoordinate(
          start,
          originCoordinate,
          progress,
        );

        setDriverCoordinate(nextCoordinate);
        dispatch(setDriverLocation(nextCoordinate));
        return;
      }

      const rideProgress = Math.min((step - approachSteps) / rideSteps, 1);
      const nextCoordinate = interpolateCoordinate(
        originCoordinate,
        destinationCoordinate,
        rideProgress,
      );

      setDriverCoordinate(nextCoordinate);
      dispatch(setDriverLocation(nextCoordinate));

      if (rideProgress >= 1) {
        clearInterval(interval);
        dispatch(setRideStatus('Completed'));
        updateRideStatus(currentRide.id, 'Completed').catch(() => undefined);
        setCanContinue(true);
      }
    }, 900);

    return () => clearInterval(interval);
  }, [currentRide?.id, destinationCoordinate, dispatch, originCoordinate]);

  const handleContinue = () => {
    navigation.navigate('Payment');
  };

  return (
    <View style={styles.container}>
      <MapViewComponent
        destination={destinationCoordinate}
        driverCoordinate={driverCoordinate}
        origin={originCoordinate}
      />

      <View style={[styles.panel, {bottom: tabBarHeight + 12}]}>
        <Text style={styles.statusLabel}>Estado del viaje</Text>
        <Text style={styles.status}>
          {formatRideStatus(rideStatus || 'Driver assigned')}
        </Text>
        <View style={styles.metrics}>
          <Text style={styles.metric}>
            {formatDistance(currentRide?.distanceKm)}
          </Text>
          <Text style={styles.metric}>
            {formatDuration(currentRide?.durationMin)}
          </Text>
          <Text style={styles.metric}>
            {formatCurrency(currentRide?.estimatedFare)}
          </Text>
        </View>
        <Text style={styles.destination}>{destination?.address}</Text>
        <Button
          disabled={!canContinue}
          onPress={handleContinue}
          style={styles.button}
          title={
            canContinue ? 'Continuar al pago' : 'Esperando que termine el viaje'
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 14,
  },
  container: {
    flex: 1,
  },
  destination: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
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
    flexWrap: 'wrap',
    marginTop: 14,
    rowGap: 8,
  },
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 26,
    borderWidth: 1,
    left: 16,
    padding: 16,
    position: 'absolute',
    right: 16,
  },
  status: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: '900',
    marginTop: 4,
  },
  statusLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
