export const getSeasonById = async (id: number) => {
  try {
    const user = sessionStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;

    const response = await fetch(`/api/season/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Failed to fetch season");

    return await response.json();
  } catch (err) {
    console.error("Error fetching season:", err);
    throw err;
  }
};
