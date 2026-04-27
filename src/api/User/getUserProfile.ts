export async function getUserProfile(token: string) {
  const res = await fetch("/api/User/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to load profile");
  return await res.json();
}
