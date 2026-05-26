import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import Button from '../../components/Button';
import Input from '../../components/Input';
import colors from '../../constants/colors';
import {loginUser} from '../../services/authService';
import {setAuthError, setAuthLoading} from '../../store/authSlice';
import globalStyles from '../../styles/globalStyles';
import {getReadableErrorMessage} from '../../utils/errorMessages';
import {validateLoginForm} from '../../utils/validators';

export default function LoginScreen({navigation}) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm(previous => ({
      ...previous,
      [field]: value,
    }));
    setErrors(previous => ({
      ...previous,
      [field]: '',
    }));
  };

  const handleLogin = async () => {
    const validation = validateLoginForm(form);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setMessage('');
      setLoading(true);
      dispatch(setAuthLoading(true));
      await loginUser(form.email, form.password);
    } catch (error) {
      const readableError = getReadableErrorMessage(error);
      setMessage(readableError);
      dispatch(setAuthError(readableError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={globalStyles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={globalStyles.keyboardAvoidingView}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <View style={styles.brandBlock}>
            <Text style={styles.brand}>TDERIDES</Text>
            <Text style={styles.tagline}>
              Muévete por el campus y la ciudad con una experiencia más simple.
            </Text>
          </View>

          <View style={globalStyles.card}>
            <Text style={styles.cardTitle}>Bienvenido de nuevo</Text>
            <Input
              error={errors.email}
              keyboardType="email-address"
              label="Correo electrónico"
              onChangeText={value => updateField('email', value)}
              placeholder="estudiante@ejemplo.com"
              value={form.email}
            />
            <Input
              error={errors.password}
              label="Contraseña"
              onChangeText={value => updateField('password', value)}
              placeholder="Ingresa tu contraseña"
              secureTextEntry
              value={form.password}
            />
            {message ? <Text style={styles.error}>{message}</Text> : null}
            <Button loading={loading} onPress={handleLogin} title="Ingresar" />
            <Button
              onPress={() => navigation.navigate('Register')}
              style={styles.secondaryButton}
              title="Crear cuenta"
              variant="secondary"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  brand: {
    color: colors.primary,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -2,
  },
  brandBlock: {
    marginBottom: 30,
    marginTop: 36,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 18,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 14,
  },
  secondaryButton: {
    marginTop: 10,
  },
  tagline: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    maxWidth: 320,
  },
});
