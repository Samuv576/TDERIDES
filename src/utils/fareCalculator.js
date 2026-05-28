import {getVehicleCategory} from '../constants/vehicles';

export const calculateFare = (distanceKm, durationMin, vehicleCategoryId) => {
  const vehicle = getVehicleCategory(vehicleCategoryId);

  if (!vehicle || distanceKm === null || durationMin === null) {
    return 0;
  }

  const fare =
    vehicle.baseFare +
    distanceKm * vehicle.pricePerKm +
    durationMin * vehicle.pricePerMinute;
  return Math.round(fare);
};