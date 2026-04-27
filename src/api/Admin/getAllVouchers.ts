export async function getAllVouchers(token: string) {
  const res = await fetch("/api/voucher/get-all-by-key", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch vouchers");
  return res.json();
}
