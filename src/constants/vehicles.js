export const vehicleCategories = [
  {
    id: 'economy',
    name: 'Económico',
    description: 'Viajes diarios a menor costo',
    seats: 4,
    baseFare: 3500,
    pricePerKm: 1200,
    pricePerMinute: 150,
  },
  {
    id: 'xl',
    name: 'XL',
    description: 'Más espacio para grupos',
    seats: 6,
    baseFare: 5000,
    pricePerKm: 1700,
    pricePerMinute: 200,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Viaje con mayor comodidad',
    seats: 4,
    baseFare: 8000,
    pricePerKm: 2500,
    pricePerMinute: 300,
  },
];

export const getVehicleCategory = categoryId =>
  vehicleCategories.find(vehicle => vehicle.id === categoryId);