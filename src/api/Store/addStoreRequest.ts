import { StoreRequests } from "@/types/index";
export const addStoreRequest = async (request: {
  storeName: string;
  storeLocation: string;
  phoneNumber: string;
  basketCount: number;
  basketContents: string;
}) => {
  try {
    const user = sessionStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;

    if (!token) {
      throw new Error("Missing authentication token");
    }

    const payload = {
      storeName: request.storeName,
      storeLocation: request.storeLocation,
      phoneNumber: request.phoneNumber,
      basketCount: request.basketCount,
      basketContents: request.basketContents,
    };

    console.log("📦 Payload being sent:", payload);

    const response = await fetch("/api/store/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Server responded with error:", errorText);
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Store request submitted successfully:", data);

    return data;
  } catch (error: any) {
    console.error("❌ Error submitting store request:", error.message || error);
    throw error;
  }
};
