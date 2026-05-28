import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import colors from '../constants/colors';
import {formatCurrency} from '../utils/formatters';

const vehicleIcons = {
  economy: '🚗',
  xl: '🚙',
  premium: '🏎️',
};

export default function VehicleCard({vehicle, fare, selected, onPress}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({pressed}) => [
        styles.card,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>{vehicleIcons[vehicle.id]}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{vehicle.name}</Text>
        <Text style={styles.description}>{vehicle.description}</Text>
        <Text style={styles.meta}>{vehicle.seats} puestos</Text>
      </View>
      <View style={styles.priceBox}>
        <Text style={styles.price}>{formatCurrency(fare)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 14,
    padding: 16,
  },
  content: {
    flex: 1,
    marginLeft: 14,
  },
  description: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 18,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  iconText: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '800',
  },
  meta: {
    color: colors.primaryMuted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
  pressed: {
    opacity: 0.86,
  },
  price: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  priceBox: {
    alignItems: 'flex-end',
  },
  selected: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
});
