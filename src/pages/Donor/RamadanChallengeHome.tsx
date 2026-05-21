import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export default function RamadanChallengeHome() {
  const { user } = useAuth();

  const [status, setStatus] = useState<any>(null);
  const [points, setPoints] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // تحميل البيانات
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const s = await fetch("/api/challenge/status", {
          headers: { Authorization: `Bearer ${user.token}` },
        }).then((r) => r.json());

        const p = await fetch("/api/challenge/my-points", {
          headers: { Authorization: `Bearer ${user.token}` },
        }).then((r) => r.json());

        setStatus(s);
        setPoints(p);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  // بدء التحدي
  const startChallenge = async () => {
    await fetch("/api/bond/create-session", {
      method: "POST",
      headers: { Authorization: `Bearer ${user.token}` },
    });

    window.location.reload();
  };

  if (loading) return <p className="p-6">جاري التحميل...</p>;

  return (
    <div className="min-h-screen bg-emerald-700 flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md space-y-6">

        <h1 className="text-3xl font-black text-emerald-700 text-center">
          تحدّي 10 أيام خير رمضان
        </h1>

        {/* حالة التحدي */}
        <div className="bg-emerald-50 p-6 rounded-2xl text-center">
          <p className="text-lg font-bold text-emerald-700">
            {status?.challengeStatus}
          </p>
          <p className="text-sm text-emerald-600">
            الأيام المتبقية: {status?.remainingDays}
          </p>
        </div>

        {/* نقاطي */}
        <div className="bg-emerald-50 p-6 rounded-2xl text-center">
          <p className="text-3xl font-black text-emerald-700">
            {points?.myPoints} / 10
          </p>
          <p className="text-sm text-emerald-600">نقاطك في التحدي</p>
        </div>

        {/* زر بدء التحدي */}
        {!status?.isActive && (
          <button
            onClick={startChallenge}
            className="w-full py-3 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800"
          >
            ابدأ التحدي الآن
          </button>
        )}

        {/* روابط */}
        <div className="space-y-3">
          <Link to="/donor/points">
            <button className="w-full py-3 rounded-xl bg-white border border-emerald-700 text-emerald-700 font-bold hover:bg-emerald-50">
              نقاطي
            </button>
          </Link>

          <Link to={`/donor/winners/${status?.challengeId}`}>
            <button className="w-full py-3 rounded-xl bg-yellow-500 text-white font-bold hover:bg-yellow-600">
              ⭐ عرض المتصدرين
            </button>
          </Link>

          <Link to="/donor/status">
            <button className="w-full py-3 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300">
              حالة التحدي
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
