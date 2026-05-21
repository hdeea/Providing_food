export async function getPendingRestaurantRequests() {
  const token = sessionStorage.getItem("token");

  const response = await fetch("/api/admin/pending", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pending restaurant requests");
  }

  return await response.json();
}
