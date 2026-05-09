export async function getAllChallenges() {
  const user = sessionStorage.getItem("user");
  const token = user ? JSON.parse(user).token : null;

  const res = await fetch("/api/challenge", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to load challenges");

  return await res.json();
}
