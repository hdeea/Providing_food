export interface GiftBond {
  id: string;
  donorUserId?: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  numberOfBonds: number;
  bondPrice: number;
  totalAmount: number;
  stripeSessionId?: string;
  paymentIntentId?: string;
  status: 'pending' | 'paid' | 'unknown';
  createdAt: string;
}

const normalizeStatus = (value: unknown): GiftBond['status'] => {
  const status = String(value || '').trim().toLowerCase();
  if (status === 'paid' || status === 'completed') return 'paid';
  if (status === 'pending') return 'pending';
  return 'unknown';
};

export const getAllGiftBonds = async (): Promise<GiftBond[]> => {
  try {
    const user = sessionStorage.getItem('user');
    const token = user ? JSON.parse(user).token : null;

    const response = await fetch('/api/GiftBond/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`فشل في جلب الهدايا: ${response.status}`);
    }

    const rawData = await response.json();
    const data = Array.isArray(rawData) ? rawData : [];

    return data.map((item: any) => {
      const numberOfBonds = Number(item.NumberOfBonds ?? item.numberOfBonds ?? 0);
      const bondPrice = Number(item.BondPrice ?? item.bondPrice ?? item.price ?? 0);

      return {
        id:
          String(item.ftDonationId || item.id || item.donationId || item.DonorUserId || '') || '',
        donorUserId: String(item.DonorUserId || item.donorUserId || item.donorId || ''),
        recipientName: String(item.RecipientName || item.recipientName || item.recipient || 'Unknown'),
        recipientPhone: String(item.RecipientPhone || item.recipientPhone || item.phone || 'Unknown'),
        recipientAddress: String(item.RecipientAddress || item.recipientAddress || item.address || 'Unknown'),
        numberOfBonds,
        bondPrice,
        totalAmount:
          Number(item.TotalAmount ?? item.totalAmount ?? item.Total ?? numberOfBonds * bondPrice),
        stripeSessionId: String(item.StripeSessionId || item.stripeSessionId || item.stripeSession || ''),
        paymentIntentId: String(item.PaymentIntentId || item.paymentIntentId || ''),
        status: normalizeStatus(item.Status ?? item.status),
        createdAt: String(item.CreatedAt || item.createdAt || new Date().toISOString()),
      };
    });
  } catch (error) {
    console.error('فشل في جلب الهدايا:', error);
    throw error;
  }
};