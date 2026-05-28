import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import colors from '../constants/colors';

export default function OptionSelector({
  label,
  options,
  selectedValue,
  onSelect,
  error,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.options}>
        {options.map(option => {
          const optionValue = option.value || option;
          const optionLabel = option.label || option;

          return (
            <Pressable
              accessibilityRole="button"
              key={optionValue}
              onPress={() => onSelect(optionValue)}
              style={({pressed}) => [
                styles.option,
                selectedValue === optionValue && styles.selected,
                pressed && styles.pressed,
              ]}>
              <Text
                style={[
                  styles.optionText,
                  selectedValue === optionValue && styles.selectedText,
                ]}>
                {optionLabel}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 6,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  option: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  optionText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  options: {
    columnGap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
  },
  pressed: {
    opacity: 0.8,
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectedText: {
    color: colors.surface,
  },
});
