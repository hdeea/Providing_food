export async function getVoucherQR(token: string, code: string) {
  const res = await fetch(`/api/voucher/qr/${code}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch QR");

  return res.blob(); // لأنه صورة
}
