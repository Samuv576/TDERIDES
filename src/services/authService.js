import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {auth} from '../config/firebase';

export const registerUser = async (email, password) => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );
  return credential.user;
};

export const loginUser = async (email, password) => {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );
  return credential.user;
};

export const logoutUser = async () => signOut(auth);

export const listenToAuthChanges = callback =>
  onAuthStateChanged(auth, callback);
