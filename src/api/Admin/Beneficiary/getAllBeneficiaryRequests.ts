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

    const data = await response.json();

    const BASE_URL = "https://localhost:7060";

    const fixed = data.map((r: any) => ({
      ...r,
      maritalStatusProofImage: r.maritalStatusProofImage
        ? BASE_URL + r.maritalStatusProofImage
        : null,

      familySizeProofImage: r.familySizeProofImage
        ? BASE_URL + r.familySizeProofImage
        : null
    }));

    return fixed;

  } catch (error) {
    console.error("Error fetching beneficiary requests:", error);
    throw error;
  }
};
