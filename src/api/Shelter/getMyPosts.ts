export async function getMyShelterPosts() {
  const user = sessionStorage.getItem("user");
  const token = user ? JSON.parse(user).token : null;

  const res = await fetch("/api/shelter-posts/my-posts", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return [];

  return await res.json();
}
