export interface GiftBondPrice {
  id: string;
  price: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getActiveGiftBondPrice = async (): Promise<GiftBondPrice | null> => {
  try {
    const user = sessionStorage.getItem('user');
    const token = user ? JSON.parse(user).token : null;

    const response = await fetch('/api/GiftBond/active-price', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No active price found
      }
      throw new Error(`فشل في جلب السعر النشط: ${response.status}`);
    }

    const data: GiftBondPrice = await response.json();
    return data;
  } catch (error) {
    console.error('فشل في جلب سعر الهدية النشط:', error);
    throw error;
  }
};