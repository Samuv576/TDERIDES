import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import {db} from '../config/firebase';
import {serializeRide} from '../utils/firestoreSerializers';

export const createRide = async ride => {
  const rideData = {
    userId: ride.userId,
    origin: ride.origin,
    destination: ride.destination,
    vehicleCategory: ride.vehicleCategory,
    distanceKm: ride.distanceKm,
    durationMin: ride.durationMin,
    estimatedFare: ride.estimatedFare,
    paymentMethod: ride.paymentMethod || '',
    status: ride.status || 'Driver assigned',
  };
  const payload = {
    ...rideData,
    createdAt: serverTimestamp(),
    completedAt: null,
  };

  const docRef = await addDoc(collection(db, 'rides'), payload);

  await updateDoc(docRef, {
    id: docRef.id,
  });

  return {
    id: docRef.id,
    ...rideData,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
};

export const updateRideStatus = async (rideId, status) => {
  await updateDoc(doc(db, 'rides', rideId), {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const completeRide = async (rideId, paymentMethod) => {
  const payload = {
    paymentMethod,
    status: 'Completed',
    completedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await updateDoc(doc(db, 'rides', rideId), payload);

  return payload;
};

export const subscribeToUserRides = (userId, callback, onError) => {
  const ridesQuery = query(
    collection(db, 'rides'),
    where('userId', '==', userId),
  );

  return onSnapshot(
    ridesQuery,
    snapshot => {
      const rides = snapshot.docs
        .map(item =>
          serializeRide({
            id: item.id,
            ...item.data(),
          }),
        )
        .sort((currentRide, nextRide) => {
          const currentDate = new Date(currentRide.createdAt || 0).getTime();
          const nextDate = new Date(nextRide.createdAt || 0).getTime();

          return nextDate - currentDate;
        });
      callback(rides);
    },
    onError,
  );
};
