export async function activateChallenge(id: number) {
  const user = sessionStorage.getItem("user");
  const token = user ? JSON.parse(user).token : null;

  const todayUtc = new Date();
  todayUtc.setUTCHours(0, 0, 0, 0);

  const tomorrowUtc = new Date(todayUtc);
  tomorrowUtc.setUTCDate(tomorrowUtc.getUTCDate() + 1);

  const res = await fetch(`/api/challenge/${id}/activate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      startDate: todayUtc.toISOString(),
      endDate: tomorrowUtc.toISOString()
    })
  });

  if (!res.ok) throw new Error("Failed to activate challenge");

  // 🔥 السيرفر يرجّع نص وليس JSON
  return await res.text();
}
