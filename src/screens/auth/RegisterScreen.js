import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import Button from '../../components/Button';
import Input from '../../components/Input';
import OptionSelector from '../../components/OptionSelector';
import colors from '../../constants/colors';
import {registerUser} from '../../services/authService';
import {requestPhotoLibraryPermission} from '../../services/permissionService';
import {
  createUserProfile,
  uploadProfilePhoto,
} from '../../services/userService';
import {setAuthUser} from '../../store/authSlice';
import {setProfile, setSelectedLanguage} from '../../store/userSlice';
import globalStyles from '../../styles/globalStyles';
import {getReadableErrorMessage} from '../../utils/errorMessages';
import {validateProfileForm} from '../../utils/validators';

const genderOptions = [
  'Femenino',
  'Masculino',
  'No binario',
  'Prefiero no decirlo',
];
const languageOptions = [
  {label: 'Español', value: 'Spanish'},
  {label: 'Inglés', value: 'English'},
];

export default function RegisterScreen({navigation}) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    gender: '',
    email: '',
    language: 'Spanish',
    password: '',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
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

  const selectPhoto = async () => {
    try {
      const hasPermission = await requestPhotoLibraryPermission();

      if (!hasPermission) {
        setMessage('Permite el acceso a tus fotos para agregar una imagen.');
        return;
      }

      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.75,
        selectionLimit: 1,
      });

      if (result.assets?.[0]) {
        setProfilePhoto(result.assets[0]);
        setMessage('');
      }
    } catch (error) {
      setMessage(getReadableErrorMessage(error));
    }
  };

  const handleRegister = async () => {
    const validation = validateProfileForm(form, {
      requirePassword: true,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setMessage('');
      setLoading(true);
      const firebaseUser = await registerUser(form.email, form.password);
      let profilePhotoUrl = '';

      if (profilePhoto) {
        try {
          profilePhotoUrl = await uploadProfilePhoto(
            firebaseUser.uid,
            profilePhoto,
          );
        } catch {
          profilePhotoUrl = '';
        }
      }

      const profile = await createUserProfile(firebaseUser.uid, {
        ...form,
        profilePhotoUrl,
      });

      dispatch(
        setAuthUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        }),
      );
      dispatch(setProfile(profile));
      dispatch(setSelectedLanguage(profile.language));
    } catch (error) {
      setMessage(getReadableErrorMessage(error));
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
          contentContainerStyle={globalStyles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <Text style={globalStyles.title}>Crear cuenta</Text>
          <Text style={globalStyles.subtitle}>
            Completa tu perfil para empezar a solicitar viajes.
          </Text>

          <View style={styles.formCard}>
            <Pressable
              accessibilityRole="button"
              onPress={selectPhoto}
              style={styles.photoPicker}>
              {profilePhoto?.uri ? (
                <Image source={{uri: profilePhoto.uri}} style={styles.photo} />
              ) : (
                <Text style={styles.photoText}>Agregar foto de perfil</Text>
              )}
            </Pressable>

            <Input
              autoCapitalize="words"
              error={errors.fullName}
              label="Nombre completo"
              maxLength={50}
              onChangeText={value => updateField('fullName', value)}
              placeholder="Máximo 50 caracteres"
              value={form.fullName}
            />
            <Input
              error={errors.phoneNumber}
              keyboardType="number-pad"
              label="Número de teléfono"
              onChangeText={value => updateField('phoneNumber', value)}
              placeholder="Solo números"
              value={form.phoneNumber}
            />
            <OptionSelector
              error={errors.gender}
              label="Género"
              onSelect={value => updateField('gender', value)}
              options={genderOptions}
              selectedValue={form.gender}
            />
            <Input
              error={errors.email}
              keyboardType="email-address"
              label="Correo electrónico"
              onChangeText={value => updateField('email', value)}
              placeholder="estudiante@ejemplo.com"
              value={form.email}
            />
            <OptionSelector
              error={errors.language}
              label="Idioma"
              onSelect={value => updateField('language', value)}
              options={languageOptions}
              selectedValue={form.language}
            />
            <Input
              error={errors.password}
              label="Contraseña"
              onChangeText={value => updateField('password', value)}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              value={form.password}
            />
            {message ? <Text style={styles.error}>{message}</Text> : null}
            <Button
              loading={loading}
              onPress={handleRegister}
              title="Crear cuenta"
            />
            <Button
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              title="Volver al inicio de sesión"
              variant="ghost"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginTop: 6,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 14,
  },
  formCard: {
    marginTop: 22,
  },
  photo: {
    borderRadius: 46,
    height: 92,
    width: 92,
  },
  photoPicker: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 52,
    borderWidth: 1,
    height: 104,
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    width: 104,
  },
  photoText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    maxWidth: 74,
    textAlign: 'center',
  },
});
