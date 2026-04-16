import { StoreRequests } from "@/types";

export const getStoreRequests = async (): Promise<StoreRequests[]> => {
  try {
    const user = sessionStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;

const response = await fetch("/api/store/my-requests", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching store requests:", error);
    throw error;
  }
};
