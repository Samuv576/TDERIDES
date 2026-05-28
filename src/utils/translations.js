const translations = {
  Spanish: {
    common: {
      language: 'Idioma',
      spanish: 'Español',
      english: 'Inglés',
      saveLanguage: 'Guardar idioma',
    },
    navigation: {
      requestRide: 'Solicitar viaje',
      chooseVehicle: 'Elegir vehículo',
      tracking: 'Seguimiento',
      payment: 'Pago',
      ride: 'Viaje',
      history: 'Historial',
      profile: 'Perfil',
      settings: 'Ajustes',
    },
    settings: {
      title: 'Ajustes',
      subtitle:
        'Elige el idioma preferido para la estructura de la aplicación.',
      saved: 'Preferencia de idioma guardada.',
      infoTitle: 'Preferencia activa',
      infoText:
        'El idioma seleccionado se guarda en tu perfil y actualiza las secciones principales de la app.',
    },
    payment: {
      title: 'Pago',
      subtitle: 'Selecciona un método para confirmar el pago de tu viaje.',
      estimatedTotal: 'Total estimado',
      selectMethod: 'Selecciona un método de pago.',
      noRide: 'No se encontró un viaje activo.',
      confirm: 'Confirmar pago',
      payWith: 'Pagar con',
      methods: {
        creditCard: 'Tarjeta de crédito',
        mercadoPago: 'MercadoPago',
        cash: 'Efectivo',
      },
    },
    history: {
      loading: 'Cargando historial de viajes...',
      title: 'Historial de viajes',
      subtitle:
        'Revisa tus viajes completados y los detalles de cada trayecto.',
      emptyTitle: 'Aún no tienes viajes',
      emptyText:
        'Los viajes completados aparecerán aquí después de confirmar el pago.',
    },
    rideCard: {
      unknownDestination: 'Destino desconocido',
      currentLocation: 'Ubicación actual',
      origin: 'Origen',
      vehicle: 'Vehículo',
      noStatus: 'Sin estado',
    },
    rideStatus: {
      'Driver assigned': 'Conductor asignado',
      'Driver arriving': 'Conductor en camino',
      'In progress': 'Viaje en curso',
      Completed: 'Completado',
    },
  },
  English: {
    common: {
      language: 'Language',
      spanish: 'Spanish',
      english: 'English',
      saveLanguage: 'Save language',
    },
    navigation: {
      requestRide: 'Request ride',
      chooseVehicle: 'Choose vehicle',
      tracking: 'Tracking',
      payment: 'Payment',
      ride: 'Ride',
      history: 'History',
      profile: 'Profile',
      settings: 'Settings',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Choose the preferred language for the app structure.',
      saved: 'Language preference saved.',
      infoTitle: 'Active preference',
      infoText:
        'The selected language is saved in your profile and updates the main app sections.',
    },
    payment: {
      title: 'Payment',
      subtitle: 'Select a method to confirm your ride payment.',
      estimatedTotal: 'Estimated total',
      selectMethod: 'Select a payment method.',
      noRide: 'No active ride was found.',
      confirm: 'Confirm payment',
      payWith: 'Pay with',
      methods: {
        creditCard: 'Credit card',
        mercadoPago: 'MercadoPago',
        cash: 'Cash',
      },
    },
    history: {
      loading: 'Loading ride history...',
      title: 'Ride history',
      subtitle: 'Review your completed rides and trip details.',
      emptyTitle: 'You have no rides yet',
      emptyText: 'Completed rides will appear here after confirming payment.',
    },
    rideCard: {
      unknownDestination: 'Unknown destination',
      currentLocation: 'Current location',
      origin: 'Origin',
      vehicle: 'Vehicle',
      noStatus: 'No status',
    },
    rideStatus: {
      'Driver assigned': 'Driver assigned',
      'Driver arriving': 'Driver arriving',
      'In progress': 'In progress',
      Completed: 'Completed',
    },
  },
};

export const getTranslation = (language, key) => {
  const dictionary = translations[language] || translations.Spanish;

  return key.split('.').reduce((value, part) => {
    if (!value || typeof value !== 'object') {
      return undefined;
    }

    return value[part];
  }, dictionary);
};

export default translations;
