const RATING_WEIGHT = 100;
const RENT_WEIGHT = 10;
const RECENT_DIVIDER = 1000000000;

export const getTotalPotential = (
  rating: number = 0.0,
  numberOfRents: number = 0,
  recentlyActive: number = 1743016720,
): number => {
  return (
    rating * RATING_WEIGHT +
    numberOfRents * RENT_WEIGHT +
    recentlyActive / RECENT_DIVIDER
  );
};
