export const rejectStoreRequest = async (id: number) => {
  try {
    const user = sessionStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;

    const response = await fetch(`/api/store/reject/${id}`, {
      method: "POST",
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
    console.error("Error rejecting store request:", error);
    throw error;
  }
};
