import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {db, storage} from '../config/firebase';
import {serializeUserProfile} from '../utils/firestoreSerializers';

const getBlobFromUri = uri =>
  new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.onload = () => resolve(request.response);
    request.onerror = () =>
      reject(new Error('No se pudo preparar la foto de perfil.'));
    request.responseType = 'blob';
    request.open('GET', uri, true);
    request.send(null);
  });

export const uploadProfilePhoto = async (userId, photo) => {
  if (!photo?.uri) {
    return null;
  }

  const blob = await getBlobFromUri(photo.uri);
  const photoRef = ref(storage, `profilePhotos/${userId}/profile.jpg`);

  await uploadBytes(photoRef, blob);

  if (typeof blob.close === 'function') {
    blob.close();
  }

  return getDownloadURL(photoRef);
};

export const createUserProfile = async (userId, profile) => {
  const profileData = {
    id: userId,
    fullName: profile.fullName.trim(),
    phoneNumber: profile.phoneNumber.trim(),
    gender: profile.gender,
    email: profile.email.trim().toLowerCase(),
    language: profile.language,
    profilePhotoUrl: profile.profilePhotoUrl || '',
  };
  const payload = {
    ...profileData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'users', userId), payload);

  return {
    ...profileData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const getUserProfile = async userId => {
  const snapshot = await getDoc(doc(db, 'users', userId));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    ...serializeUserProfile({
      id: snapshot.id,
      ...snapshot.data(),
    }),
  };
};

export const updateUserProfile = async (userId, updates) => {
  const payload = {
    ...updates,
    updatedAt: serverTimestamp(),
  };

  const userRef = doc(db, 'users', userId);

  try {
    await updateDoc(userRef, payload);
  } catch (error) {
    if (error.code !== 'not-found') {
      throw error;
    }

    await setDoc(userRef, {
      id: userId,
      ...payload,
      createdAt: serverTimestamp(),
    });
  }

  return {
    id: userId,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
};
