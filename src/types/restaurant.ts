export interface RestaurantRequest {
  id: number;
  restaurantName: string;
  ownerName: string;
  status: "pending" | "approved" | "rejected";
  address?: string;
  description?: string;
  restaurantEmail?: string;
  restaurantPhone?: string;
  licenseImagePath?: string;
  createdAt?: string;
}
