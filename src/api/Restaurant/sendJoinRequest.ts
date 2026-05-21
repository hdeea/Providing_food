export async function sendJoinRequest(token: string) {
  const response = await fetch("/api/Restaurant/join-request", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "فشل إرسال طلب الانضمام");
  }

  return await response.json();
}
