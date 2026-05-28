import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import Loading from '../../components/Loading';
import RideCard from '../../components/RideCard';
import colors from '../../constants/colors';
import useTranslation from '../../hooks/useTranslation';
import {subscribeToUserRides} from '../../services/rideService';
import globalStyles from '../../styles/globalStyles';
import {getReadableErrorMessage} from '../../utils/errorMessages';

export default function RideHistoryScreen() {
  const {t} = useTranslation();
  const {user} = useSelector(state => state.auth);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return undefined;
    }

    const unsubscribe = subscribeToUserRides(
      user.uid,
      nextRides => {
        setRides(nextRides);
        setLoading(false);
      },
      error => {
        setMessage(getReadableErrorMessage(error));
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [user?.uid]);

  if (loading) {
    return <Loading message={t('history.loading')} />;
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={globalStyles.screen}>
      <FlatList
        ListEmptyComponent={
          <View style={[globalStyles.card, styles.emptyCard]}>
            <Text style={styles.emptyTitle}>{t('history.emptyTitle')}</Text>
            <Text style={styles.emptyText}>{t('history.emptyText')}</Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={globalStyles.title}>{t('history.title')}</Text>
            <Text style={globalStyles.subtitle}>{t('history.subtitle')}</Text>
            {message ? <Text style={styles.error}>{message}</Text> : null}
          </View>
        }
        contentContainerStyle={styles.content}
        data={rides}
        keyExtractor={item => item.id}
        renderItem={({item}) => <RideCard ride={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 112,
  },
  emptyCard: {
    marginTop: 22,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 14,
  },
  header: {
    marginBottom: 18,
  },
});
