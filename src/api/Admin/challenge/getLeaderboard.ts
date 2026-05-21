export async function getLeaderboard(id: number, token: string) {
  const res = await fetch(`/api/challenge/${id}/leaderboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to load leaderboard");

  return await res.json();
}
