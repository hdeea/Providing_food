import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function MyDonationsPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    async function fetchDonations() {
      const response = await fetch("/api/DonationRestaurant", {
        headers: { Authorization: `Bearer ${user?.token}` }
      });

      if (!response.ok) return;

      const data = await response.json();
      setDonations(data);
    }

    fetchDonations();
  }, [user]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border border-emerald-100">

      <h1 className="text-2xl font-bold text-emerald-700 mb-6">تبرعاتي 🍽️</h1>

      {donations.length === 0 ? (
        <p className="text-gray-600">لا يوجد تبرعات بعد.</p>
      ) : (
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-emerald-50 text-emerald-700">
              <th className="p-3 border">الكمية</th>
              <th className="p-3 border">التاريخ</th>
              <th className="p-3 border">مكان الاستلام</th>
              <th className="p-3 border">الحالة</th>
            </tr>
          </thead>

          <tbody>
            {donations.map((d: any, i: number) => (
              <tr key={i} className="hover:bg-emerald-50 transition">
                <td className="p-3 border">{d.quantity}</td>
                <td className="p-3 border">{d.dateDonated}</td>
                <td className="p-3 border">{d.deliveryLocation}</td>
                <td className="p-3 border">
                  <span
                    className={`
                      px-3 py-1 rounded-lg text-white
                      ${d.status === "Accepted" ? "bg-emerald-600" :
                        d.status === "Pending" ? "bg-yellow-500" :
                        "bg-red-500"}
                    `}
                  >
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
