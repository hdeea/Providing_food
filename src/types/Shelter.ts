export interface Shelter {
  id: number;
  name: string;
  description: string;
  proofImageUrl: string;
  status: "Approved" | "Rejected" | "Pending";
  createdAt: string;
  userId: number | null;
  isVerified: number | null;
}

export interface ShelterPost {
  id: number;
  title: string;
  description: string;
  shelterName: string;
  requiredMeals: number;
  collectedMeals: number;
  status: string;
  displayImageUrl: string;
  donations: Donation[];
}

export interface Donation {
  restaurantName: string;
  meals: number;
}
