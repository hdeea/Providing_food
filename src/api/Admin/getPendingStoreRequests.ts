import { StoreRequests } from "@/types";

export const getPendingStoreRequests = async (): Promise<StoreRequests[]> => {
  try {
    const user = sessionStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;

    const response = await fetch("/api/store/pending", {
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
    console.error("Error fetching pending store requests:", error);
    throw error;
  }
};
