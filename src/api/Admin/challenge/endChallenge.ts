export async function endChallenge(id: number) {
  const user = sessionStorage.getItem("user");
  const token = user ? JSON.parse(user).token : null;

  const res = await fetch(`/api/challenge/${id}/end`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to end challenge");

  return await res.text();
}
