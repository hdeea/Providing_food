export const getAllBeneficiaryRequests = async () => {
  try {
    const user = sessionStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;

    const response = await fetch(`/api/Beneficiary/all`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching beneficiary requests:", error);
    throw error;
  }
};
