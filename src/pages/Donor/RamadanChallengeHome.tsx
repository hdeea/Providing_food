import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getChallengeStatus, getDonorPoints } from "@/api/ramadanChallenge";

export default function RamadanChallengeHome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [status, setStatus] = useState<any>(null);
  const [points, setPoints] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const [statusData, pointsData] = await Promise.all([
          getChallengeStatus(),
          getDonorPoints(),
        ]);

        setStatus(statusData);
        setPoints(pointsData);
      } catch (err: any) {
        setError(err?.message || "فشل في تحميل بيانات التحدي.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const isLoggedOut = !user;

  if (loading)
    return <p className="p-6 text-center">جاري التحميل، يرجى الانتظار...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-beige-50 to-white flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl border border-amber-200 shadow-xl p-8 md:p-12 relative overflow-hidden" dir="rtl">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl text-center mb-6 text-green-800">
              تحدي 10 أيام خير في رمضان
            </h1>
            <p className="text-lg text-gray-700 text-center leading-relaxed mb-4">
              شارك في تحدي التبرع اليومي، أكمل 10 أيام متتالية وحصل على نقاط ومكافآت عند الإتمام.
            </p>
            <p className="text-base text-gray-600 text-center leading-relaxed mb-8">
              كل يوم تبرع فيه يُسجل يومًا مكتملًا. إذا فُقد يوم، يتم إعادة العد إلى الصفر.
            </p>

            {error && (
              <div className="rounded-3xl bg-red-50 border border-red-200 p-4 text-red-700 mb-6">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm text-green-700">الأيام المكتملة</p>
                <p className="text-3xl font-black text-green-900">{status?.completedDays ?? 0}</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-sm text-amber-700">النقاط الحالية</p>
                <p className="text-3xl font-black text-amber-900">{points?.points ?? 0}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-sm text-purple-700">حالة الفوز</p>
                <p className="text-3xl font-black text-purple-900">
                  {status?.isWinner ? "فائز" : "قيد المتابعة"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <button
                onClick={() => {
                  if (isLoggedOut) {
                    navigate("/donor/login?return=/donor/donation-type");
                    return;
                  }
                  navigate("/donor/donation-type");
                }}
                className="w-full py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700"
              >
                ابدأ التبرع اليومي
              </button>
              <button
                onClick={() => navigate("/donor/status")}
                className="w-full py-4 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300"
              >
                عرض حالة التحدي
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Link to="/donor/points" className="block">
                <div className="rounded-3xl bg-slate-100 p-5 text-center hover:bg-slate-200 transition">
                  <p className="text-sm text-slate-500">نقاطي</p>
                  <p className="mt-2 text-xl font-bold text-slate-900">{points?.points ?? 0}</p>
                </div>
              </Link>
              <Link to="/donor/winners" className="block">
                <div className="rounded-3xl bg-yellow-50 p-5 text-center hover:bg-yellow-100 transition">
                  <p className="text-sm text-yellow-700">قائمة الفائزين</p>
                  <p className="mt-2 text-xl font-bold text-yellow-900">عرض</p>
                </div>
              </Link>
              <Link to="/donor/donate-cash-challenge" className="block">
                <div className="rounded-3xl bg-emerald-50 p-5 text-center hover:bg-emerald-100 transition">
                  <p className="text-sm text-emerald-700">تبرع مالي</p>
                  <p className="mt-2 text-xl font-bold text-emerald-900">ابدأ الآن</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
