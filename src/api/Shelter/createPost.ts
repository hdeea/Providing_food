export async function createShelterPost(formData: FormData) {
  const user = sessionStorage.getItem("user");
  const token = user ? JSON.parse(user).token : null;

  const res = await fetch("/api/shelter-posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to create post");
  }

  return await res.json();
}
