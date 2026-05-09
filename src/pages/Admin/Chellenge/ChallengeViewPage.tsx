import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getChallengeById } from "@/api/Admin/challenge/getChallengeById";
import { activateChallenge } from "@/api/Admin/challenge/activateChallenge";
import { endChallenge } from "@/api/Admin/challenge/endChallenge";

export default function ChallengeViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false); // 🔥 مهم

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getChallengeById(Number(id));
        setChallenge(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, refresh]); // 🔥 لما refresh يتغير → يعيد تحميل البيانات

  if (loading) return <div className="p-6 animate-pulse">جاري تحميل بيانات التحدي...</div>;
  if (!challenge) return <div className="p-6">لم يتم العثور على التحدي.</div>;

 const handleActivate = async () => {
  await activateChallenge(challenge.id);
  setRefresh(prev => !prev); // 🔥 يجبر React يعيد التحميل
};

  const handleEnd = async () => {
    await endChallenge(challenge.id);
    setRefresh(prev => !prev); // 🔥 نفس الشي للإنهاء
  };

  return (
    <div className="p-6 space-y-8">

      {/* Back */}
      <button
        onClick={() => navigate("/admin/challenges")}
        className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 transition"
      >
        ← رجوع
      </button>

      {/* Title */}
      <h1 className="text-3xl font-bold text-slate-900 animate-fade-in">
        {challenge.name}
      </h1>

      {/* Animated Card */}
      <div
        className={`
          rounded-3xl shadow-xl p-8 space-y-6 transition-all duration-500
          ${challenge.isActive 
            ? "bg-white/70 backdrop-blur-xl border border-white/40 animate-slide-up" 
            : "bg-slate-100/80 backdrop-blur-sm border border-slate-200 grayscale-[20%]"
          }
        `}
      >
        {/* Status */}
        <div className="flex items-center gap-3 animate-fade-in">
          <span className="text-slate-700 font-medium">الحالة:</span>
          <span
            className={`
              px-3 py-1 rounded-full text-xs font-semibold transition-all
              ${challenge.isActive 
                ? "bg-emerald-100 text-emerald-700" 
                : "bg-red-100 text-red-700 animate-wiggle"
              }
            `}
          >
            {challenge.isActive ? "نشط" : "غير نشط"}
          </span>
        </div>

        {/* Dates */}
        <p className="text-slate-700 animate-fade-in">
          <strong>تاريخ البداية:</strong> {challenge.startDate}
        </p>
        <p className="text-slate-700 animate-fade-in">
          <strong>تاريخ النهاية:</strong> {challenge.endDate}
        </p>

        <div className="h-px bg-white/40"></div>

        {/* Progress */}
        <div className="space-y-2 animate-fade-in">
          <p className="font-semibold text-slate-800">نسبة التقدم</p>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`
                h-full transition-all duration-700
                ${challenge.isActive ? "bg-emerald-600 animate-progress" : "bg-slate-400"}
              `}
              style={{ width: challenge.isActive ? "50%" : "0%" }}
            ></div>
          </div>
        </div>

        {/* Button */}
        <div className="pt-4">
          {!challenge.isActive ? (
            <button
              onClick={handleActivate}
              className="
                px-5 py-2 bg-emerald-600 text-white rounded-xl 
                hover:bg-emerald-700 transition animate-pulse-soft
              "
            >
              تفعيل التحدي
            </button>
          ) : (
            <button
              onClick={handleEnd}
              className="
                px-5 py-2 bg-red-600 text-white rounded-xl 
                hover:bg-red-700 transition
              "
            >
              إنهاء التحدي
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
