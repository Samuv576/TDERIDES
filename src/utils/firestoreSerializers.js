export const serializeFirestoreDate = value => {
  if (!value) {
    return value;
  }

  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }

  if (
    typeof value.seconds === 'number' &&
    typeof value.nanoseconds === 'number'
  ) {
    return new Date(
      value.seconds * 1000 + Math.round(value.nanoseconds / 1000000),
    ).toISOString();
  }

  return value;
};

export const serializeUserProfile = profile => {
  if (!profile) {
    return null;
  }

  return {
    ...profile,
    createdAt: serializeFirestoreDate(profile.createdAt),
    updatedAt: serializeFirestoreDate(profile.updatedAt),
  };
};

export const serializeRide = ride => {
  if (!ride) {
    return null;
  }

  return {
    ...ride,
    createdAt: serializeFirestoreDate(ride.createdAt),
    completedAt: serializeFirestoreDate(ride.completedAt),
    updatedAt: serializeFirestoreDate(ride.updatedAt),
  };
};
