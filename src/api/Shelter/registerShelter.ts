export const registerShelter = async (formData: FormData) => {
  const user = sessionStorage.getItem("user");
  const token = user ? JSON.parse(user).token : null;

  const response = await fetch("/api/Shelter/register", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to register shelter");
  }

  return await response.json();
};
