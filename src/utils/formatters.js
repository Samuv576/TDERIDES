export const formatCurrency = amount =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

export const formatDistance = distanceKm =>
  `${Number(distanceKm || 0).toFixed(1)} km`;

export const formatDuration = durationMin =>
  `${Math.round(Number(durationMin || 0))} min`;

export const formatDate = value => {
  if (!value) {
    return 'Fecha pendiente';
  }

  const date = value.toDate ? value.toDate() : new Date(value);

  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatRideStatus = status => {
  const statuses = {
    'Driver assigned': 'Conductor asignado',
    'Driver arriving': 'Conductor en camino',
    'In progress': 'Viaje en curso',
    Completed: 'Completado',
  };

  return statuses[status] || status || 'Sin estado';
};
