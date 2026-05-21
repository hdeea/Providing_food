export const updateSeason = async (id, data) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = user?.token;

  const res = await fetch(`/api/AdminEvents/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate
    })
  });

  if (!res.ok) throw new Error("Failed to update season");

  return true;
};
