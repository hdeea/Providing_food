export async function acknowledgeVoucher(code: string, token: string) {
  const res = await fetch(`/api/voucher/redeem/${code}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to redeem voucher");
  return res.text(); // ← مهم جداً
}
