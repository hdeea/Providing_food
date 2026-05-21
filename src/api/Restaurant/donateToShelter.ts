export async function donateToShelter(token, postId, meals) {
  const response = await fetch("/api/shelter-donations/donate", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ postId, meals })
  });

  const raw = await response.text();

  let data;

  try {
    data = JSON.parse(raw);
  } catch {
    data = raw;
  }

  if (!response.ok) {
    throw new Error(
      (data && data.error) ||
      (data && data.message) ||
      raw ||
      "حدث خطأ غير معروف"
    );
  }

  if (typeof data === "string") {
    return { message: data };
  }

  return data;
}
