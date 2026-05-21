import { useEffect, useState } from "react";
import { getAllChallenges } from "@/api/Admin/challenge/getAllChallenges";
import { deleteChallenge } from "@/api/Admin/challenge/deleteChallenge";
import { useNavigate } from "react-router-dom";

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllChallenges();
        setChallenges(data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6">جاري تحميل التحديات...</div>;

  return (
    <div className="p-6 space-y-8">

      {/* عنوان الصفحة */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Challenges Management</h1>

        <button
          onClick={() => navigate("/admin/challenges/create")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow hover:bg-emerald-700 transition"
        >
          <span className="text-lg">＋</span>
          <span>Create Challenge</span>
        </button>
      </div>

      {/* رسالة داخل الصفحة */}
      {message && (
        <div
          className={`
            p-4 rounded-xl font-semibold text-center
            ${message.type === "success"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"}
          `}
        >
          {message.text}
        </div>
      )}

      {/* البحث + الفلترة */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

        <input
          type="text"
          placeholder="ابحث عن تحدي..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">الكل</option>
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
        </select>

      </div>

      {/* الكروت */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges
          .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
          .filter((c) =>
            filter === "all"
              ? true
              : filter === "active"
              ? c.isActive
              : !c.isActive
          )
          .map((c: any) => (
            <div
              key={c.id}
              className="
                bg-gradient-to-br from-white/80 to-white/60 
                backdrop-blur-xl 
                border border-white/30 
                rounded-2xl 
                shadow-[0_8px_30px_rgba(0,0,0,0.05)]
                hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]
                transition-all 
                p-6 space-y-4
              "
            >
              {/* العنوان + الحالة */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">{c.name}</h2>

                <span
                  className={`
                    px-3 py-1 rounded-full text-xs font-semibold
                    ${c.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}
                  `}
                >
                  {c.isActive ? "نشط" : "غير نشط"}
                </span>
              </div>

              {/* عدد الأيام */}
              <p className="text-slate-700 mt-3">
                <strong>عدد الأيام:</strong>{" "}
                {Math.ceil(
                  (new Date(c.endDate).getTime() - new Date(c.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}
              </p>

              {/* تاريخ البداية */}
              <p className="text-slate-700">
                <strong>تاريخ البداية:</strong> {c.startDate}
              </p>

              {/* تاريخ النهاية */}
              <p className="text-slate-700">
                <strong>تاريخ النهاية:</strong> {c.endDate}
              </p>

              {/* الأزرار */}
              <div className="space-y-3">

                {/* عرض التفاصيل */}
                <button
                  onClick={() => navigate(`/admin/challenges/${c.id}`)}
                  className="
                    w-full py-2.5 rounded-xl font-semibold
                    bg-emerald-600 text-white
                    hover:bg-emerald-700
                    transition-all duration-200
                    shadow-sm hover:shadow-md
                  "
                >
                  عرض التفاصيل
                </button>

                {/* ⭐ عرض المتصدرين */}
                <button
                  onClick={() => navigate(`/donor/winners/${c.id}`)}
                  className="
                    w-full py-2.5 rounded-xl font-semibold
                    bg-yellow-500 text-white
                    hover:bg-yellow-600
                    transition-all duration-200
                    shadow-sm hover:shadow-md
                  "
                >
                  ⭐ عرض المتصدرين
                </button>

                {/* تعديل */}
                <button
                  onClick={() => navigate(`/admin/challenges/edit/${c.id}`)}
                  className="
                    w-full py-2.5 rounded-xl font-semibold
                    bg-blue-600 text-white
                    hover:bg-blue-700
                    transition-all duration-200
                    shadow-sm hover:shadow-md
                  "
                >
                  تعديل التحدي
                </button>

                {/* حذف */}
                <button
                  onClick={() => setDeleteTarget(c.id)}
                  className="
                    w-full py-2.5 rounded-xl font-semibold
                    bg-red-600 text-white
                    hover:bg-red-700
                    transition-all duration-200
                    shadow-sm hover:shadow-md
                  "
                >
                  حذف التحدي
                </button>

              </div>
            </div>
          ))}
      </div>

      {/* 🔥 Modal الحذف */}
      {deleteTarget !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">

            <h2 className="text-xl font-bold text-slate-800 text-center">
              هل أنتِ متأكدة من حذف هذا التحدي؟
            </h2>

            <p className="text-center text-slate-600">
              لا يمكن التراجع عن هذه العملية بعد تنفيذها.
            </p>

            <div className="flex gap-4 mt-6">
              <button
                onClick={async () => {
                  try {
                    const msg = await deleteChallenge(deleteTarget);
                    setMessage({ type: "success", text: msg });
                    setChallenges(prev => prev.filter(x => x.id !== deleteTarget));
                  } catch {
                    setMessage({ type: "error", text: "حدث خطأ أثناء الحذف" });
                  }
                  setDeleteTarget(null);
                  setTimeout(() => setMessage(null), 3000);
                }}
                className="w-full py-2.5 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 transition"
              >
                نعم، احذفيه
              </button>

              <button
                onClick={() => setDeleteTarget(null)}
                className="w-full py-2.5 rounded-xl font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 transition"
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
