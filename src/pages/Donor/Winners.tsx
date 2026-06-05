import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getChallengeWinners } from "@/api/ramadanChallenge";

export default function Winners() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/donor/login?return=/donor/winners", { replace: true });
      return;
    }

    const loadWinners = async () => {
      try {
        const data = await getChallengeWinners();
        setWinners(data.filter((item) => item.isWinner));
      } catch (err: any) {
        setError(err?.message || "فشل في تحميل قائمة الفائزين.");
      } finally {
        setLoading(false);
      }
    };

    loadWinners();
  }, [navigate, user]);

  if (loading) return <p className="p-6">جاري التحميل...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-700 py-10">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-lg text-right" dir="rtl">
        <h1 className="text-3xl font-black text-emerald-700 mb-6 text-center">
          الفائزون في تحدي رمضان
        </h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {winners.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-6 text-center text-slate-600">
            لا يوجد فائزون حتى الآن. استمر في التبرع اليومي!
          </div>
        ) : (
          <div className="space-y-4">
            {winners.map((winner, index) => (
              <div key={index} className="rounded-3xl bg-emerald-50 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-emerald-800">{winner.fullName}</p>
                    <p className="text-sm text-slate-600">أكمل {winner.completedDays} يوم</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-emerald-900">{winner.points}</p>
                    <p className="text-xs text-slate-600">نقطة</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
