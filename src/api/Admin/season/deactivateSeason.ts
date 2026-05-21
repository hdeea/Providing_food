export const deactivateSeason = async (id) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = user?.token;

  const res = await fetch(`/api/AdminEvents/${id}/deactivate`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Failed to deactivate season");

  return await res.text();
};
