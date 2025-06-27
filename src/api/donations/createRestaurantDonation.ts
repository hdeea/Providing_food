import { RestaurantDonation } from '@/types/restaurant';

export const createRestaurantDonation = async (payload: RestaurantDonation) => {
  const response = await fetch('/api/DonationRestaurant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`فشل في إرسال التبرع: ${message}`);
  }

  return await response.json();
};
