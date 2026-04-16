export const getMyStoreRequests = async () => {
  try {
    const user = sessionStorage.getItem("user");
    console.log("USER FROM SESSION:", user);

    const token = user ? JSON.parse(user).token : null;
    console.log("TOKEN:", token);

    if (!token) {
      throw new Error("Missing authentication token");
    }

    const response = await fetch("/api/store/my-requests", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    console.log("RESPONSE STATUS:", response.status);

    if (!response.ok) {
      const text = await response.text();
      console.log("RESPONSE BODY:", text);
      throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching store requests:", error);
    throw error;
  }
};
