import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getChallengeStatus } from "@/api/ramadanChallenge";

export default function ChallengeStatus() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/donor/login?return=/donor/status", { replace: true });
      return;
    }

    const loadStatus = async () => {
      try {
        const data = await getChallengeStatus();
        setStatus(data);
      } catch (err: any) {
        setError(err?.message || "فشل في تحميل حالة التحدي.");
      } finally {
        setLoading(false);
      }
    };

    loadStatus();
  }, [navigate, user]);

  if (loading) return <p className="p-6">جاري التحميل...</p>;

  if (error)
    return (
      <div className="p-6 text-center text-red-600 font-bold">{error}</div>
    );

  if (!status)
    return (
      <div className="p-6 text-center text-red-600 font-bold">
        لا يوجد تحدي متاح حالياً.
      </div>
    );

  const progress = Math.min(Math.max(status.progress ?? (status.completedDays / 10) * 100, 0), 100);

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-700 py-10">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-lg text-right" dir="rtl">
        <h1 className="text-3xl font-black text-emerald-700 mb-4">حالة تحدي رمضان</h1>

        <div className="space-y-4">
          <div className="rounded-3xl bg-emerald-50 p-5">
            <p className="text-sm text-emerald-700">اليوم الحالي</p>
            <p className="text-4xl font-black text-emerald-900">{status.currentDay || 0}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-600">الأيام المكتملة</p>
              <p className="text-3xl font-black text-slate-900">{status.completedDays}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-600">نقاطك</p>
              <p className="text-3xl font-black text-slate-900">{status.points}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm text-slate-600">آخر تبرع</p>
            <p className="mt-1 text-lg text-slate-800">{status.lastDonationDate || "لم يتم بعد"}</p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm text-slate-600">حالة الفوز</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {status.isWinner ? "فائز في التحدي 🎉" : "لم تنهِ التحدي بعد"}
            </p>
          </div>

          <div className="rounded-3xl bg-emerald-50 p-5">
            <div className="flex justify-between text-sm text-slate-600 mb-3">
              <span>التقدم نحو 10 أيام</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => navigate("/donor/donation-type")}
            className="w-full rounded-2xl bg-emerald-700 text-white py-3 text-lg font-black hover:bg-emerald-800"
          >
            الانتقال إلى التبرع اليومي
          </button>
        </div>
      </div>
    </div>
  );
}
