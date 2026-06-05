import { useEffect, useState } from "react";

export default function RestaurantDonationsAdmin() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    async function fetchDonations() {
      const response = await fetch("/api/DonationRestaurant");

      if (!response.ok) return;

      const data = await response.json();
      setDonations(data);
    }

    fetchDonations();
  }, []);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border border-emerald-100" dir="rtl">

      <h1 className="text-2xl font-bold text-emerald-700 mb-6">تبرعات المطاعم </h1>

      {donations.length === 0 ? (
        <p className="text-gray-600">لا يوجد تبرعات حتى الآن.</p>
      ) : (
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-emerald-50 text-emerald-700">
              <th className="p-3 border">اسم المطعم</th>
              <th className="p-3 border">الكمية</th>
              <th className="p-3 border">التاريخ</th>
              <th className="p-3 border">مكان الاستلام</th>
            </tr>
          </thead>

          <tbody>
            {donations.map((d: any, i: number) => (
              <tr key={i} className="hover:bg-emerald-50 transition">
                <td className="p-3 border">{d.restaurantName}</td>
                <td className="p-3 border">{d.quantity}</td>
                <td className="p-3 border">{d.dateDonated}</td>
                <td className="p-3 border">{d.deliveryLocation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
