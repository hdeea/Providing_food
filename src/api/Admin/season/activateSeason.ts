export const activateSeason = async (id) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = user?.token;

  const res = await fetch(`/api/AdminEvents/${id}/activate`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Failed to activate season");

  return await res.text();
};
