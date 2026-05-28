import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/Button';
import colors from '../../constants/colors';
import useTranslation from '../../hooks/useTranslation';
import {paymentMethods, simulatePayment} from '../../services/paymentService';
import {completeRide} from '../../services/rideService';
import {resetRide, setRideStatus} from '../../store/rideSlice';
import globalStyles from '../../styles/globalStyles';
import {getReadableErrorMessage} from '../../utils/errorMessages';
import {formatCurrency} from '../../utils/formatters';

export default function PaymentScreen({navigation}) {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {currentRide} = useSelector(state => state.ride);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const getPaymentMethodLabel = method => t(`payment.methods.${method}`);

  const handleConfirmPayment = async () => {
    if (!selectedMethod) {
      setMessage(t('payment.selectMethod'));
      return;
    }

    if (!currentRide?.id) {
      setMessage(t('payment.noRide'));
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      await simulatePayment({
        method: selectedMethod,
        amount: currentRide.estimatedFare,
      });
      await completeRide(currentRide.id, selectedMethod);
      dispatch(setRideStatus('Completed'));
      dispatch(resetRide());
      navigation.getParent()?.navigate('History');
    } catch (error) {
      setMessage(getReadableErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={globalStyles.screen}>
      <ScrollView
        contentContainerStyle={globalStyles.scrollContent}
        style={globalStyles.screen}>
        <Text style={globalStyles.title}>{t('payment.title')}</Text>
        <Text style={globalStyles.subtitle}>{t('payment.subtitle')}</Text>

        <View style={[globalStyles.card, styles.summaryCard]}>
          <Text style={styles.summaryLabel}>{t('payment.estimatedTotal')}</Text>
          <Text style={styles.amount}>
            {formatCurrency(currentRide?.estimatedFare)}
          </Text>
        </View>

        <View style={styles.methods}>
          {paymentMethods.map(method => (
            <Pressable
              accessibilityRole="button"
              key={method}
              onPress={() => {
                setSelectedMethod(method);
                setMessage('');
              }}
              style={({pressed}) => [
                styles.method,
                selectedMethod === method && styles.selectedMethod,
                pressed && styles.pressed,
              ]}>
              <Text
                style={[
                  styles.methodText,
                  selectedMethod === method && styles.selectedMethodText,
                ]}>
                {getPaymentMethodLabel(method)}
              </Text>
            </Pressable>
          ))}
        </View>

        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Button
          loading={loading}
          onPress={handleConfirmPayment}
          title={
            selectedMethod
              ? `${t('payment.payWith')} ${getPaymentMethodLabel(
                  selectedMethod,
                )}`
              : t('payment.confirm')
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  amount: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: '900',
    marginTop: 6,
  },
  message: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 14,
  },
  method: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  methodText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  methods: {
    marginBottom: 8,
    marginTop: 20,
  },
  pressed: {
    opacity: 0.84,
  },
  selectedMethod: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectedMethodText: {
    color: colors.surface,
  },
  summaryCard: {
    marginTop: 22,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
