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
    <div className="p-6 space-y-6">

      {/* زر الرجوع */}
      <button
        onClick={() => navigate("/admin/challenges")}
        className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 transition"
      >
        ← رجوع
      </button>

      <h1 className="text-3xl font-bold text-slate-900">Create Challenge</h1>

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

        {/* زر الإنشاء */}
        <button
          onClick={handleCreate}
          disabled={loading}
          className="
            w-full px-4 py-2 bg-emerald-600 text-white rounded-xl 
            hover:bg-emerald-700 transition font-semibold
          "
        >
          {loading ? "Creating..." : "Create Challenge +"}
        </button>

      </div>
    </div>
  );
}
