export interface DonationIndividualDto {
  requesId: number;  
  foodId: number;    
  status: 'Pending' | 'Approved' | 'Rejected';  
  foodName: string;
  description: string;
  image: string;
  country: string;
  vegetarian: boolean;
  userEmail?: string;
  userType?: string;
  reviewedAt?: string;
  id?: number; // للفرونت فقط 
}

// Individual donation transaction
export interface DonationTransaction {
  id: string;
  donorId: string;
  donorName: string;
  type: 'money' | 'food';
  amount?: number;
  foodItems?: string;
  targetGroup: 'families' | 'students' | 'elderly' | 'general';
  status: 'pending' | 'processed' | 'delivered';
  createdAt: string;
  processedAt?: string;
}
export interface FoodBondsRequest {
  beneficiaryName: string;
  restaurantName: string;
  numberOfMeals: number;
  expiryDate: string;
};

// Help request from needy individuals (renamed for clarity)
export interface HelpRequest {
  id: number;
  userId: number;
  name: string;
  phone: string;
  numberOfPeople: number;
  maritalStatus: string;
  maritalStatusImage: string;
  familySizeImage: string;
  status: string;
  createdAt: string;
}


// Food voucher issuance type
export interface BondsIssuance {
  id: number;
  beneficiaryName: string;
  restaurantName: string;
  numberOfMeals: number;
  qrCode: string;
  createdAt: string;
  expiryDate: string;
  statusName: string;
}

export interface ScanResult {
  success: boolean;
  bond: BondsIssuance;
  message?: string;
}
export interface FoodBondResponse {
  BondId: number;
  QRCode: string;
  Message: string;
}
