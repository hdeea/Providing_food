import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateChallenge } from "@/api/Admin/challenge/updateChallenge";
import { getChallengeById } from "@/api/Admin/challenge/getChallengeById";

export default function EditChallengePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  // رسالة داخل الصفحة
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Modal صغير للتأكيد
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getChallengeById(Number(id));
      setName(data.name);
      setStartDate(data.startDate);
      setEndDate(data.endDate);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const msg = await updateChallenge(Number(id), {
        name,
        startDate,
        endDate,
      });

      setMessage({ type: "success", text: msg });
      setTimeout(() => setMessage(null), 3000);

      navigate("/admin/challenges");
    } catch {
      setMessage({ type: "error", text: "حدث خطأ أثناء التحديث" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) return <div className="p-6">جاري تحميل البيانات...</div>;

  return (
    <div className="p-6 space-y-6">

      {/* زر الرجوع */}
      <button
        onClick={() => navigate("/admin/challenges")}
        className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 transition"
      >
        ← رجوع
      </button>

      <h1 className="text-3xl font-bold text-slate-900">Edit Challenge</h1>

      {/* رسالة داخل الصفحة */}
      {message && (
        <div
          className={`
            p-3 rounded-xl font-semibold text-center text-sm
            ${message.type === "success"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"}
          `}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4 max-w-lg">

        {/* الاسم */}
        <div>
          <label className="block mb-1 font-medium text-slate-700">Challenge Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* تاريخ البداية */}
        <div>
          <label className="block mb-1 font-medium text-slate-700">Start Date</label>
          <input
            type="datetime-local"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* تاريخ النهاية */}
        <div>
          <label className="block mb-1 font-medium text-slate-700">End Date</label>
          <input
            type="datetime-local"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* زر التحديث */}
        <button
          onClick={() => setShowConfirm(true)}
          className="
            w-full py-2.5 rounded-xl font-semibold
            bg-blue-600 text-white
            hover:bg-blue-700
            transition-all duration-200
            shadow-sm hover:shadow-md
          "
        >
          تحديث التحدي
        </button>

      </div>

      {/* 🔥 Modal صغير للتأكيد */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-full max-w-sm shadow-xl space-y-3">

            <h2 className="text-lg font-bold text-slate-800 text-center">
              هل تريدين حفظ التعديلات؟
            </h2>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  handleUpdate();
                }}
                className="w-full py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                نعم، احفظي
              </button>

              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 transition"
              >
                إلغاء
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
