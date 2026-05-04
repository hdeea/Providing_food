export const approveShelterRequest = async (id: number) => {
  try {
    const user = sessionStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;

    const response = await fetch(`/api/Shelter/${id}/approve`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Approval failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error approving shelter request:", error);
    throw error;
  }
};
