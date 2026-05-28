import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../constants/colors';
import {getVehicleCategory} from '../constants/vehicles';
import useTranslation from '../hooks/useTranslation';
import {
  formatCurrency,
  formatDate,
  formatDistance,
  formatDuration,
} from '../utils/formatters';

export default function RideCard({ride}) {
  const {t} = useTranslation();
  const vehicle = getVehicleCategory(ride.vehicleCategory);

  const statusKey = `rideStatus.${ride.status}`;
  const statusLabel = t(statusKey);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.destination}>
            {ride.destination?.address || t('rideCard.unknownDestination')}
          </Text>
          <Text style={styles.date}>{formatDate(ride.createdAt)}</Text>
        </View>
        <Text style={styles.status}>
          {statusLabel === statusKey
            ? ride.status || t('rideCard.noStatus')
            : statusLabel}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.detailRow}>
        <Text style={styles.label}>{t('rideCard.origin')}</Text>
        <Text style={styles.value}>
          {ride.origin?.address || t('rideCard.currentLocation')}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>{t('rideCard.vehicle')}</Text>
        <Text style={styles.value}>
          {vehicle?.name || ride.vehicleCategory}
        </Text>
      </View>
      <View style={styles.metrics}>
        <Text style={styles.metric}>{formatDistance(ride.distanceKm)}</Text>
        <Text style={styles.metric}>{formatDuration(ride.durationMin)}</Text>
        <Text style={styles.metric}>{formatCurrency(ride.estimatedFare)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  date: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  destination: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    maxWidth: 220,
  },
  detailRow: {
    marginBottom: 10,
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: 14,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  metric: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  metrics: {
    columnGap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    rowGap: 8,
  },
  status: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    color: colors.surface,
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  value: {
    color: colors.text,
    fontSize: 14,
  },
});
