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

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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

      setMessage({
        type: "success",
        text: msg,
      });

      setTimeout(() => setMessage(null), 3000);

      navigate("/admin/challenges");
    } catch {
      setMessage({
        type: "error",
        text: "حدث خطأ أثناء التحديث",
      });

      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600 text-lg font-semibold">
        جاري تحميل البيانات...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 via-white to-emerald-50">

      {/* Header */}
      <div className="flex items-start justify-between mb-10">

        {/* Title */}
        <div className="text-right">
          <div className="flex items-center gap-4 justify-end">
  <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center shadow-sm">
              <span className="text-3xl">✏️</span>
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900">
                تعديل التحدي
              </h1>

             
            </div>

          

          </div>
        </div>

        {/* Back */}
        <button
          onClick={() => navigate("/admin/challenges")}
          className="
            flex items-center gap-2
            px-5 py-2.5
            rounded-2xl
            border border-slate-200
            bg-white/80
            backdrop-blur-md
            text-slate-700
            hover:bg-white
            hover:shadow-md
            transition-all
          "
        >
          <span>رجوع</span>
          <span>←</span>
        </button>

      </div>

      {/* Message */}
      {message && (
        <div
          className={`
            mb-6 p-4 rounded-2xl text-center font-semibold
            ${message.type === "success"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"}
          `}
        >
          {message.text}
        </div>
      )}

      {/* Card */}
      <div
        className="
          max-w-3xl mx-auto
          bg-white/80
          backdrop-blur-xl
          border border-white/60
          rounded-[32px]
          shadow-[0_20px_60px_rgba(15,23,42,0.08)]
          overflow-hidden
        "
      >

        {/* Top */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-7">
          <div className="flex items-center justify-between">

            <div className="text-right">
              <h2 className="text-3xl font-black text-white">
                تعديل التحدي
              </h2>

              <p className="text-white/80 mt-1">
                عدّل معلومات التحدي بسهولة
              </p>
            </div>

            

          </div>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">

          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              اسم التحدي
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full h-14 px-5
                rounded-2xl
                border border-slate-200
                bg-slate-50/80
                focus:outline-none
                focus:ring-4 focus:ring-emerald-100
                focus:border-emerald-400
                transition-all
              "
            />
          </div>

          {/* Start */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              تاريخ البداية
            </label>

            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="
                w-full h-14 px-5
                rounded-2xl
                border border-slate-200
                bg-slate-50/80
                focus:outline-none
                focus:ring-4 focus:ring-emerald-100
                focus:border-emerald-400
                transition-all
              "
            />
          </div>

          {/* End */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              تاريخ النهاية
            </label>

            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="
                w-full h-14 px-5
                rounded-2xl
                border border-slate-200
                bg-slate-50/80
                focus:outline-none
                focus:ring-4 focus:ring-emerald-100
                focus:border-emerald-400
                transition-all
              "
            />
          </div>

          {/* Update */}
          <button
            onClick={() => setShowConfirm(true)}
            className="
              w-full py-4
              rounded-2xl
              font-bold text-white
              bg-gradient-to-r from-emerald-500 to-teal-500
              hover:from-emerald-600 hover:to-teal-600
              shadow-[0_10px_30px_rgba(16,185,129,0.25)]
              hover:shadow-[0_14px_40px_rgba(16,185,129,0.35)]
              transition-all duration-300
            "
          >
            تحديث التحدي
          </button>

        </div>
      </div>

      {/* Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5">

            <h2 className="text-2xl font-black text-slate-800 text-center">
              تأكيد التعديل
            </h2>

            <p className="text-center text-slate-500">
              هل تريد حفظ التعديلات الجديدة؟
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => {
                  setShowConfirm(false);
                  handleUpdate();
                }}
                className="
                  w-full py-3 rounded-2xl
                  bg-emerald-500 text-white font-bold
                  hover:bg-emerald-600
                  transition-all
                "
              >
           نعم، احفظ
              </button>

              <button
                onClick={() => setShowConfirm(false)}
                className="
                  w-full py-3 rounded-2xl
                  bg-slate-100 text-slate-700 font-bold
                  hover:bg-slate-200
                  transition-all
                "
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