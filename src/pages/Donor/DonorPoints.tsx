import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getDonorPoints } from "@/api/ramadanChallenge";

export default function DonorPoints() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/donor/login?return=/donor/points", { replace: true });
      return;
    }

    const fetchPoints = async () => {
      try {
        const result = await getDonorPoints();
        setData(result);
      } catch (err: any) {
        setError(err?.message || "فشل في تحميل النقاط.");
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, [navigate, user]);

  if (loading) return <p className="p-6">تحميل...</p>;

  if (error)
    return (
      <div className="p-6 text-center text-red-600 font-bold">{error}</div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-700 py-10" dir="rtl">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md text-right">
        <h1 className="text-3xl font-black text-emerald-700 mb-4">نقاطي</h1>

        <div className="space-y-4">
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm text-slate-500">النقاط الحالية</p>
            <p className="mt-2 text-5xl font-black text-emerald-900">{data.points}</p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">الأيام المكتملة</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{data.completedDays}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">اليوم الحالي</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{data.currentDay}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm text-slate-500">آخر تاريخ تبرع</p>
            <p className="mt-2 text-lg text-slate-700">{data.lastDonationDate || "لم يتم بعد"}</p>
          </div>

          <div className="rounded-3xl bg-emerald-50 p-6">
            <p className="text-sm text-slate-500">حالة الفوز</p>
            <p className="mt-2 text-lg font-bold text-emerald-800">
              {data.isWinner ? "فائز بالتحدي" : "لم يتم الفوز بعد"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
