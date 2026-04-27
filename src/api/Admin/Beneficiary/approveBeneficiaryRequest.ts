export const approveBeneficiaryRequest = async (id: number) => {
  try {
    const user = sessionStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;

    const response = await fetch(`/api/Beneficiary/approve/${id}`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({})
});


    if (!response.ok) {
      throw new Error(`Approval failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error approving beneficiary request:", error);
    throw error;
  }
};
