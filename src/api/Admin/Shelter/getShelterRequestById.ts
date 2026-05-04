export const getShelterRequestById = async (id: number) => {
  try {
    const response = await fetch(`/api/Shelter/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error(`❌ Error fetching shelter request ${id}:`, err);
    throw err;
  }
};
