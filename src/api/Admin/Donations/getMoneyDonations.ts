export async function getMoneyDonations(token: string, region?: string) {
  const url = region && region.trim() !== ""
    ? `/api/admin/donations?region=${encodeURIComponent(region)}`
    : `/api/admin/donations`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("فشل تحميل التبرعات المالية");

  return await res.json();
}
