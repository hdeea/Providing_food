export const getMyShelter = async () => {
  try {
    const user = sessionStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;

    if (!token) return null;

    const response = await fetch("/api/Shelter/my-shelters", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data || data.length === 0) return null;

    const shelter = data[0];

    // 🔥 توحيد القيم العربية → الإنجليزية
    let status = shelter.status;
    if (status === "تمت الموافقة") status = "Approved";
    if (status === "قيد المراجعة") status = "Pending";
    if (status === "مرفوض") status = "Rejected";

    return {
      ...shelter,
      status,
    };
  } catch {
    return null;
  }
};
