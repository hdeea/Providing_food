import { FoodBondsRequest } from '@/types/individual';

export const createFoodBond = async (foodbond: FoodBondsRequest) => {

  try {
    const response = await fetch("/api/FoodBond", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
body: JSON.stringify({
  beneficiaryName: foodbond.beneficiaryName,
  restaurantName: foodbond.restaurantName,
  numberOfMeals: foodbond.numberOfMeals,
  expiryDate: foodbond.expiryDate
})
    });

    if (!response.ok) {
      throw new Error(`فشل إنشاء السند: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(" فشل إنشاء السند:", error);
    throw error;
  }
};
