/**
 * Calculates the total price for a parking duration in hours.
 * Rule: 1st hour is full price, every additional hour is 20% off.
 * @param basePricePerHour The base price for the first hour (30-100 DA)
 * @param hours Total duration in hours
 * @returns Total price in DA
 */
export const calculateBookingPrice = (basePricePerHour: number, hours: number): number => {
  if (hours <= 0) return 0;
  if (hours === 1) return basePricePerHour;
  
  const additionalHours = hours - 1;
  const discountedPrice = basePricePerHour * 0.8;
  
  return Math.round(basePricePerHour + (additionalHours * discountedPrice));
};

/**
 * Formats a price in DA
 */
export const formatCurrency = (amount: number): string => {
  return `${amount} DA`;
};
