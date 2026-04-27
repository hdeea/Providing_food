import { ReactNode } from "react";

// User types
export interface CreateAccount {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string; // "Store Owner", "Restaurant Owner", "Beneficiary", etc.
}

export interface User {
  [x: string]: string | number | boolean;
  id: number;
  fullName: string;
  role: "admin" | "restaurant" | "individual" | "store owner" | "donor" | "shelter"|
  "beneficiary";
  token: string;
}


export type Restaurant = {
  address: ReactNode;
  restaurantId: number;
  restaurantName: string;
  restaurantEmail: string;
  restaurantPhone: string;
  restaurantAddress: string;
  userTypeName: string;
  categoryId: number;
  categoryName?: string;
  userId?: number;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  isActive?: boolean;
};


export interface Beneficiary {
  fullName: string;
  phoneNumber: string;
  familySize: number;
  maritalStatus: string;
  maritalStatusProofImage: File | null;
  familySizeProofImage: File | null;
}


// Donation types
export interface DonationRequest {
  id: string;
  restaurantId: string;
  quantity: number;
  description?: string;
  pickupDateTime: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// Food voucher types
export interface FoodVoucher {
  id: string;
  beneficiaryId: string;
  donationId?: string;
  restaurantId: string;
  mealCount: number;
  status: 'pending' | 'redeemed' | 'expired';
  qrCode: string;
  validUntil: string;
  createdAt: string;
}

export interface StoreRequests {
  requestId: number;
  storeUserId: number;
  storeName: string;
  storeLocation: string;
  phoneNumber: string;
  basketCount: number;
  basketContents: string;
  status: string;
  createdAt: string;
  approvedAt: string | null;
}
