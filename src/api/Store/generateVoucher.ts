export async function generateVoucher(payload: {
  beneficiaryName: string;
  storeName: string;
  storeLocation: string;
  value: number;
  quantity: number;
}) {
  const token = localStorage.getItem("token");

  const response = await fetch("/api/voucher/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("فشل في إنشاء السند");
  }

  return response.json();
}
