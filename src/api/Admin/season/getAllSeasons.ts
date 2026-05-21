export const getAllSeasons = async () => {
  try {
    const user = sessionStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;

    const response = await fetch(`/api/AdminEvents`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Failed to fetch seasons");

    return await response.json();
  } catch (err) {
    console.error("Error fetching seasons:", err);
    throw err;
  }
};
