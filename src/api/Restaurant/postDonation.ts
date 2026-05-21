export async function postDonation(token: string, data: any) {
  const response = await fetch("/api/DonationRestaurant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "فشل إرسال التبرع");
  }

  return await response.json();
}
