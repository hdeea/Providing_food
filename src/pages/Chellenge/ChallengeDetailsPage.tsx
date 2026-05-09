import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

export default function ChallengeDetailsPage() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/challenge/${id}`);
        if (!res.ok) throw new Error("Failed to load challenge");
        const data = await res.json();
        setChallenge(data);
      } catch {
        setChallenge(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-6">جاري تحميل تفاصيل التحدي...</div>;

  if (!challenge)
    return (
      <div className="p-6 text-center text-red-600 font-bold">
        لم يتم العثور على التحدي
      </div>
    );

  const days = Math.ceil(
    (new Date(challenge.endDate).getTime() -
      new Date(challenge.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">

      <Link to="/challenges">
        <Button className="bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-xl px-6 py-2">
          ← رجوع
        </Button>
      </Link>

      <div className="rounded-3xl bg-white shadow-xl p-10 border border-slate-200">
        <h1 className="text-4xl font-black text-slate-900 mb-4">
          {challenge.name}
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed mb-6">
          {challenge.description || "لا يوجد وصف متاح لهذا التحدي."}
        </p>

        <div className="grid sm:grid-cols-2 gap-6">

          <div className="rounded-2xl bg-emerald-50 p-6 text-center">
            <p className="text-3xl font-black text-emerald-700">{days}</p>
            <p className="text-sm text-emerald-600">عدد الأيام</p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-6 text-center">
            <p className="text-lg font-bold text-emerald-700">{challenge.startDate}</p>
            <p className="text-sm text-emerald-600">تاريخ البداية</p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-6 text-center">
            <p className="text-lg font-bold text-emerald-700">{challenge.endDate}</p>
            <p className="text-sm text-emerald-600">تاريخ النهاية</p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-6 text-center">
            <p className="text-lg font-bold text-emerald-700">
              {challenge.isActive ? "نشط" : "غير نشط"}
            </p>
            <p className="text-sm text-emerald-600">الحالة</p>
          </div>

        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link to="/individual/donate">
            <Button className="w-full rounded-full bg-emerald-700 text-white px-8 py-4 text-lg font-black hover:bg-emerald-800">
              تبرع الآن
            </Button>
          </Link>

          <Button className="w-full rounded-full bg-white border border-emerald-700 text-emerald-700 px-8 py-4 text-lg font-black hover:bg-emerald-50">
            شارك في التحدي
          </Button>
        </div>

      </div>
    </div>
  );
}
