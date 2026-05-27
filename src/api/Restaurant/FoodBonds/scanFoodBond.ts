export const scanFoodBond = async (qrCode: string) => {
  try {
    const res = await fetch("/api/FoodBond/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ qrCode }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "فشل مسح السند");
    }

    return data;
  } catch (err: any) {
    throw new Error(err.message || "خطأ غير متوقع أثناء المسح");
  }
};
