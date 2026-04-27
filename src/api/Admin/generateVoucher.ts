export async function generateVoucher(token: string, body: any) {
  const res = await fetch("/api/voucher/generate", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to generate voucher");
  return res.json();
}
