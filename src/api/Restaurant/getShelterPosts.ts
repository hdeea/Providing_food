export async function getShelterPosts(token: string) {
  const response = await fetch("/api/shelter-donations", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch shelter posts");
  }

  return await response.json();
}
