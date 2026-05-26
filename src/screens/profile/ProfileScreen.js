import React, {useEffect, useState} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Loading from '../../components/Loading';
import OptionSelector from '../../components/OptionSelector';
import colors from '../../constants/colors';
import {logoutUser} from '../../services/authService';
import {requestPhotoLibraryPermission} from '../../services/permissionService';
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePhoto,
} from '../../services/userService';
import {clearAuthUser} from '../../store/authSlice';
import {resetRide} from '../../store/rideSlice';
import {
  clearProfile,
  setProfile,
  setUserError,
  setUserLoading,
  updateProfileState,
} from '../../store/userSlice';
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

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const {profile, loading: profileLoading} = useSelector(state => state.user);
  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    gender: '',
    email: user?.email || '',
    language: 'Spanish',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      return undefined;
    }

    let isActive = true;

    const loadProfile = async () => {
      try {
        dispatch(setUserLoading(true));
        const nextProfile = await getUserProfile(user.uid);

        if (!isActive) {
          return;
        }

        if (nextProfile) {
          dispatch(setProfile(nextProfile));
          setMessage('');
          return;
        }

        dispatch(setUserLoading(false));
        setMessage('Completa los datos y guarda para crear tu perfil.');
      } catch (error) {
        if (isActive) {
          const readableError = getReadableErrorMessage(error);
          dispatch(setUserError(readableError));
          setMessage(readableError);
        }
      }
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [dispatch, user?.uid]);

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName || '',
        phoneNumber: profile.phoneNumber || '',
        gender: profile.gender || '',
        email: profile.email || user?.email || '',
        language: profile.language || 'Spanish',
      });
    }
  }, [profile, user?.email]);

  useEffect(() => {
    if (!profile && user?.email) {
      setForm(previous => ({
        ...previous,
        email: user.email,
      }));
    }
  }, [profile, user?.email]);

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
        setMessage('Permite el acceso a tus fotos para cambiar la imagen.');
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

  const handleSave = async () => {
    if (!user?.uid) {
      setMessage('No se encontró una sesión activa.');
      return;
    }

    const validation = validateProfileForm(form);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setMessage('');
      setSaving(true);
      let profilePhotoUrl = profile?.profilePhotoUrl || '';
      let photoMessage = '';

      if (profilePhoto) {
        try {
          profilePhotoUrl = await uploadProfilePhoto(user.uid, profilePhoto);
        } catch {
          photoMessage =
            'No se pudo subir la foto, pero se guardarán los demás datos.';
        }
      }

      const updates = {
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        gender: form.gender,
        email: form.email.trim().toLowerCase(),
        language: form.language,
        profilePhotoUrl,
      };

      await updateUserProfile(user.uid, updates);
      dispatch(
        updateProfileState({
          id: user.uid,
          ...updates,
        }),
      );
      setMessage(photoMessage || 'Perfil actualizado correctamente.');
    } catch (error) {
      setMessage(getReadableErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    dispatch(clearAuthUser());
    dispatch(clearProfile());
    dispatch(resetRide());
  };

  const photoUri = profilePhoto?.uri || profile?.profilePhotoUrl;

  if (profileLoading && !profile) {
    return <Loading message="Cargando tu perfil..." />;
  }

  return (
    <SafeAreaView edges={['top']} style={globalStyles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={globalStyles.keyboardAvoidingView}>
        <ScrollView
          contentContainerStyle={globalStyles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <Text style={globalStyles.title}>Perfil</Text>
          <Text style={globalStyles.subtitle}>
            Edita tu información de usuario y tu idioma preferido.
          </Text>

          <View style={[globalStyles.card, styles.summaryCard]}>
            <Pressable
              accessibilityRole="button"
              onPress={selectPhoto}
              style={styles.photoPicker}>
              {photoUri ? (
                <Image source={{uri: photoUri}} style={styles.photo} />
              ) : (
                <Text style={styles.photoText}>Seleccionar foto</Text>
              )}
            </Pressable>
            <View style={styles.summaryText}>
              <Text style={styles.profileName}>
                {form.fullName || 'Completa tu perfil'}
              </Text>
              <Text style={styles.profileEmail}>
                {form.email || user?.email || 'Correo no disponible'}
              </Text>
              <View style={styles.badgeRow}>
                <Text style={styles.badge}>
                  {form.language === 'Spanish' ? 'Español' : 'Inglés'}
                </Text>
                {form.gender ? (
                  <Text style={styles.badge}>{form.gender}</Text>
                ) : null}
              </View>
            </View>
          </View>

          <View style={styles.formCard}>
            <Input
              autoCapitalize="words"
              error={errors.fullName}
              label="Nombre completo"
              maxLength={50}
              onChangeText={value => updateField('fullName', value)}
              value={form.fullName}
            />
            <Input
              error={errors.phoneNumber}
              keyboardType="number-pad"
              label="Número de teléfono"
              onChangeText={value => updateField('phoneNumber', value)}
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
              editable={false}
              error={errors.email}
              keyboardType="email-address"
              label="Correo electrónico"
              value={form.email}
            />
            <OptionSelector
              error={errors.language}
              label="Idioma"
              onSelect={value => updateField('language', value)}
              options={languageOptions}
              selectedValue={form.language}
            />
            {message ? <Text style={styles.message}>{message}</Text> : null}
            <Button
              loading={saving}
              onPress={handleSave}
              title="Guardar cambios"
            />
            <Button
              onPress={handleLogout}
              style={styles.logoutButton}
              title="Cerrar sesión"
              variant="secondary"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeRow: {
    columnGap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    rowGap: 8,
  },
  formCard: {
    marginTop: 22,
  },
  logoutButton: {
    marginTop: 10,
  },
  message: {
    color: colors.primaryMuted,
    fontSize: 13,
    marginBottom: 14,
  },
  photo: {
    borderRadius: 46,
    height: 92,
    width: 92,
  },
  photoPicker: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 52,
    borderWidth: 1,
    height: 104,
    justifyContent: 'center',
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
  profileEmail: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  profileName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  summaryCard: {
    alignItems: 'center',
    columnGap: 16,
    flexDirection: 'row',
    marginTop: 22,
  },
  summaryText: {
    flex: 1,
  },
});
