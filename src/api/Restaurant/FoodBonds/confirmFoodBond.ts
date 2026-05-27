export const confirmFoodBond = async (bondId: number) => {
  try {
    const token = sessionStorage.getItem("token");

    const res = await fetch("/api/FoodBond/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bondId }),
    });

    // إذا الرد فاضي، ما نعمل res.json()
    let data: any = {};
    const text = await res.text();
    if (text) data = JSON.parse(text);

    if (!res.ok) {
      throw new Error(data.error || "فشل تأكيد استلام الوجبة");
    }

    return data;
  } catch (err: any) {
    throw new Error(err.message || "خطأ غير متوقع أثناء التأكيد");
  }
};
