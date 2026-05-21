export async function getStatus(token: string) {
  const res = await fetch(`/api/challenge/status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to load status");

  return await res.json();
}
