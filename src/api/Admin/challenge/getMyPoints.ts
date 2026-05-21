export async function getMyPoints(token: string) {
  const res = await fetch(`/api/challenge/my-points`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to load points");

  return await res.json();
}
