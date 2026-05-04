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
  id: number;
  userTypeId: number;
  fullName: string;
  role: "admin" | "restaurant" | "individual" | "store owner" | "donor" | "shelter owner" | "beneficiary";
  token: string;
  email?: string;
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

// Shelter types
export type Shelter = {
  id: number;
  shelterId: number;
  shelterName: string;
  shelterEmail: string;
  shelterPhone: string;
  shelterAddress: string;
  userId?: number;
  fullName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  capacity?: number;
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'active';
  createdAt?: string;
  approvedAt?: string;
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
