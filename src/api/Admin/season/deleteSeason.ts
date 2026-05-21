export const deleteSeason = async (id) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = user?.token;

  const res = await fetch(`/api/AdminEvents/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Failed to delete season");

  return true;
};
