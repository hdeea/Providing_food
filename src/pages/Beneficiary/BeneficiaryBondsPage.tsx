import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function BeneficiaryBondsPage() {
  const { user } = useAuth();
  const userId = user?.id;

  const [bonds, setBonds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBonds = async () => {
    try {
      // 🔥 جيب كل السندات من API الموجودة عندك
      const res = await fetch("/api/FoodBond/{id}"); // غيّريها حسب اسم API عندك
      const allBonds = await res.json();

      // 🔥 فلترة حسب UserId
      const myBonds = allBonds.filter((b: any) => b.userId === userId);

      setBonds(myBonds); 
    } catch (err) {
      console.error("Failed to load bonds", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMyBonds();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-700 text-xl">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-green-200">

        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          سنداتــي
        </h2>

        {bonds.length === 0 ? (
          <p className="text-center text-gray-600">لا يوجد سندات حالياً</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {bonds.map((b: any) => (
              <div
                key={b.id}
                className="bg-white p-5 rounded-xl shadow border border-green-100"
              >
                <img
                  src={`data:image/png;base64,${b.qrBase64}`}
                  className="w-40 h-40 mx-auto"
                />

                <div className="mt-4 text-center">
                  <p className="font-semibold text-lg text-green-700">
                    رقم السند: {b.code}
                  </p>

                  <p className="text-gray-600">
                    الحالة:{" "}
                    <span
                      className={
                        b.status === "Active"
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {b.status}
                    </span>
                  </p>

                  <p className="text-gray-600">
                    تاريخ الانتهاء: {b.expiryDate.split("T")[0]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
