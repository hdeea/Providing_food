// src/api/Admin/getAllStoreRequests.ts
export const getAllStoreRequests = async () => {
  try {
    const user = sessionStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;

    const response = await fetch("/api/store/allRequest", {
      method: "GET",
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
    console.error("❌ Error fetching all store requests:", error);
    throw error;
  }
};
