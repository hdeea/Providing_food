import { BondsIssuance } from '@/types/individual';

export const getAllFoodBonds = async (): Promise<BondsIssuance[]> => {
  try {
    const response = await fetch('/api/FoodBond');

    if (!response.ok) {
      throw new Error(`فشل الجلب: ${response.status}`);
    }

    const data: BondsIssuance[] = await response.json();
    return data;
  } catch (error) {
    console.error('فشل في جلب السندات:', error);
    throw error;
  }
};
