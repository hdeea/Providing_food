import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

export default function FoodBondDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bond, setBond] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadBond = async () => {
    try {
      const res = await fetch(`/api/FoodBond/${id}`);
      const data = await res.json();
      setBond(data);
    } catch (err) {
      console.error("فشل جلب السند:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBond();
  }, [id]);

  if (loading) return <div className="p-6">جاري تحميل السند...</div>;
  if (!bond) return <div className="p-6">❌ السند غير موجود</div>;

  return (
    <div className="p-6 space-y-6">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition"
      >
        ← رجوع
      </button>

      {/* Title */}
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
        تفاصيل السند #{bond.id}
      </h1>

      {/* Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow border border-slate-200 dark:border-slate-700">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
            {bond.beneficiaryName}
          </h2>

          <span
            className={`
              px-3 py-1 rounded-full text-xs font-semibold
              ${
                bond.statusName === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : bond.statusName === "Received"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }
            `}
          >
            {bond.statusName === "Received"
              ? "مستلم"
              : bond.statusName === "Pending"
              ? "قيد الانتظار"
              : "منتهي"}
          </span>
        </div>

        {/* Info */}
        <div className="space-y-2 text-slate-700 dark:text-slate-300 text-lg">
          <p>🍽️ المطعم: <span className="font-medium">{bond.restaurantName}</span></p>
          <p>🥗 عدد الوجبات: <span className="font-medium">{bond.numberOfMeals}</span></p>
          <p>📅 تاريخ الإنشاء: <span className="font-medium">{bond.createdAt?.split("T")[0]}</span></p>
          <p>⏳ ينتهي في: <span className="font-medium">{bond.expiryDate?.split("T")[0]}</span></p>
          <p>🔢 رقم السند: <span className="font-medium">{bond.qrCode}</span></p>
        </div>

        {/* QR */}
        <div className="mt-6 flex justify-center">
          <div className="bg-white p-4 rounded-xl shadow">
            <QRCode value={bond.qrCode} size={200} />
          </div>
        </div>
      </div>
    </div>
  );
}
