export const submitBeneficiary = async (formData: FormData, token: string) => {
  try {
    const response = await fetch("/api/Beneficiary/submit", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`, // ⭐ أهم سطر
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "فشل إرسال الطلب");
    }

    return await response.json();

  } catch (error: any) {
    console.error("Error submitting beneficiary:", error.message);
    throw error;
  }
};
