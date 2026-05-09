export async function deleteChallenge(id: number) {
  const user = sessionStorage.getItem("user");
  const token = user ? JSON.parse(user).token : null;

  const res = await fetch(`/api/challenge/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Failed to delete challenge");

  return await res.text();
}
