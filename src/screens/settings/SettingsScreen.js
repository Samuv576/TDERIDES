import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/Button';
import OptionSelector from '../../components/OptionSelector';
import colors from '../../constants/colors';
import useTranslation from '../../hooks/useTranslation';
import {updateUserProfile} from '../../services/userService';
import {setSelectedLanguage, updateProfileState} from '../../store/userSlice';
import globalStyles from '../../styles/globalStyles';
import {getReadableErrorMessage} from '../../utils/errorMessages';
import {getTranslation} from '../../utils/translations';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {user} = useSelector(state => state.auth);
  const {selectedLanguage} = useSelector(state => state.user);
  const [language, setLanguage] = useState(selectedLanguage || 'Spanish');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const languageOptions = [
    {label: t('common.spanish'), value: 'Spanish'},
    {label: t('common.english'), value: 'English'},
  ];

  useEffect(() => {
    setLanguage(selectedLanguage || 'Spanish');
  }, [selectedLanguage]);

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage('');
      dispatch(setSelectedLanguage(language));

      if (user?.uid) {
        await updateUserProfile(user.uid, {
          language,
        });
        dispatch(updateProfileState({language}));
      }

      setMessage(getTranslation(language, 'settings.saved'));
    } catch (error) {
      setMessage(getReadableErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={globalStyles.screen}>
      <ScrollView
        contentContainerStyle={globalStyles.scrollContent}
        style={globalStyles.screen}>
        <Text style={globalStyles.title}>{t('settings.title')}</Text>
        <Text style={globalStyles.subtitle}>{t('settings.subtitle')}</Text>

        <View style={[globalStyles.card, styles.card]}>
          <OptionSelector
            label={t('common.language')}
            onSelect={setLanguage}
            options={languageOptions}
            selectedValue={language}
          />
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <Button
            loading={loading}
            onPress={handleSave}
            title={t('common.saveLanguage')}
          />
        </View>

        <View style={[globalStyles.card, styles.infoCard]}>
          <Text style={styles.infoTitle}>{t('settings.infoTitle')}</Text>
          <Text style={styles.infoText}>{t('settings.infoText')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 22,
  },
  infoCard: {
    marginTop: 16,
  },
  infoText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  infoTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  message: {
    color: colors.primaryMuted,
    fontSize: 13,
    marginBottom: 14,
  },
});
