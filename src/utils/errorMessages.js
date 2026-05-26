const errorMessages = {
  'auth/email-already-in-use': 'Este correo ya está registrado.',
  'auth/invalid-email': 'Ingresa un correo electrónico válido.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/network-request-failed':
    'Revisa tu conexión a internet e inténtalo de nuevo.',
  'auth/too-many-requests':
    'Demasiados intentos. Inténtalo de nuevo más tarde.',
  'auth/user-disabled': 'Esta cuenta fue deshabilitada.',
  'auth/user-not-found': 'No existe una cuenta con este correo.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'permission-denied':
    'Firebase no permitió esta acción. Revisa las reglas de Firestore o Storage.',
  'failed-precondition':
    'Firebase necesita ajustar una consulta o crear un índice para mostrar estos datos.',
  unavailable: 'El servicio no está disponible en este momento.',
};

export const getReadableErrorMessage = error => {
  if (!error) {
    return 'Ocurrió un error inesperado.';
  }

  if (errorMessages[error.code]) {
    return errorMessages[error.code];
  }

  if (errorMessages[error.message]) {
    return errorMessages[error.message];
  }

  return 'No se pudo completar la acción. Inténtalo de nuevo.';
};
