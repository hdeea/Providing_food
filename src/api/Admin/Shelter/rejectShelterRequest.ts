export const rejectShelterRequest = async (id: number) => {
  try {
    const user = sessionStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;

    const response = await fetch(`/api/Shelter/${id}/reject`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Rejection failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error rejecting shelter request:", error);
    throw error;
  }
};
