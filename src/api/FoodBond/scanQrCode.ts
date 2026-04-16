export const scanQrCode = async (qrCode: string) => {
  const response = await fetch("/api/FoodBond/scan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ qrCode }),
  });

  if (!response.ok) {
    throw new Error("فشل في مسح رمز QR");
  }

  return await response.json();
};
