export async function getVoucherByCode(token: string, code: string) {
  const res = await fetch(`/api/voucher/${code}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch voucher");
  return res.json();
}
