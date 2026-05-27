import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createChallenge } from "@/api/Admin/challenge/createChallenge";
import { toast } from "sonner";

export default function CreateChallengePage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name || !startDate || !endDate) {
      toast.error("يرجى تعبئة جميع الحقول");
      return;
    }

    setLoading(true);

    try {
      const msg = await createChallenge({
        name,
        startDate,
        endDate,
      });

      toast.success(msg || "تم إنشاء التحدي بنجاح");

      navigate("/admin/challenges");
    } catch (err) {
      toast.error("حدث خطأ أثناء إنشاء التحدي");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 via-white to-emerald-50">

      {/* Header */}
      <div className="flex items-start justify-between mb-10">

        {/* Title */}
        <div className="text-right">
          <div className="flex items-center gap-4 justify-end">

            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center shadow-sm">
              <span className="text-3xl">🏆</span>
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900">
                إنشاء تحدي جديد
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
                إضافة تحدي
              </h2>

              <p className="text-white/80 mt-1">
                أضف تحدياً جديداً للمستخدمين
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
              placeholder="مثال: عيد الفطر, رمضان"
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Start */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              تاريخ البداية
            </label>

            <input
              type="datetime-local"
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
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              تاريخ النهاية
            </label>

            <input
              type="datetime-local"
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
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Button */}
          <button
            onClick={handleCreate}
            disabled={loading}
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
            {loading ? "Creating..." : "Create Challenge"}
          </button>

        </div>
      </div>
    </div>
  );
}