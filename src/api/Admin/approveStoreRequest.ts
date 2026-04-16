export const approveStoreRequest = async (id: number) => {
  try {
    const user = sessionStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;

    const response = await fetch(`/api/store/approve/${id}`, {
      method: "POST",
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
    console.error("Error approving store request:", error);
    throw error;
  }
};
