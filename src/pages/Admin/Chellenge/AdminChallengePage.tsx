import { useEffect, useState } from "react";
import { getAllChallenges } from "@/api/Admin/challenge/getAllChallenges";
import { deleteChallenge } from "@/api/Admin/challenge/deleteChallenge";
import { useNavigate } from "react-router-dom";
import { Power, PowerOff } from "lucide-react";
import { activateChallenge } from "@/api/Admin/challenge/activateChallenge";
import { endChallenge } from "@/api/Admin/challenge/endChallenge";

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
const [refresh, setRefresh] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const activeChallenge = challenges.find((x: any) => x.isActive);

const handleActivate = async (id: number) => {
  const activeChallenge = challenges.find((x: any) => x.isActive);

  if (activeChallenge && activeChallenge.id !== id) {
    setMessage({
      type: "error",
      text: "لا يمكن تفعيل أكثر من تحدي في نفس الوقت"
    });

    setTimeout(() => setMessage(null), 3000);
    return;
  }

  await activateChallenge(id);
  setRefresh(prev => !prev);
};


const handleEnd = async (id: number) => {
  await endChallenge(id);
  setRefresh(prev => !prev);
};

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
}, [refresh]); 


  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            إدارة التحديات
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            إدارة التحديات: إنشاء، تعديل، وحذف التحديات بسهولة 
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/challenges/create")}
          className="
            inline-flex items-center gap-2
            px-4 py-2
            rounded-xl
            bg-emerald-500
            text-white
            text-sm font-medium
            hover:bg-emerald-600
            transition
            shadow-sm
          "
        >
          <span className="text-base">＋</span>
          <span>إضافة تحدي</span>
        </button>

      </div>

      {/* Message */}
      {message && (
        <div
          className={`
            rounded-2xl px-4 py-3 text-sm font-medium border
            ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-rose-50 text-rose-700 border-rose-100"
            }
          `}
        >
          {message.text}
        </div>
      )}

      {/* Search + Filter */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="ابحث عن تحدي..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              flex-1
              px-4 py-3
              rounded-2xl
              border border-slate-200
              bg-slate-50
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-200
              text-sm
            "
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="
              px-4 py-3
              rounded-2xl
              border border-slate-200
              bg-slate-50
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-200
              text-sm
            "
          >
            <option value="all">الكل</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>

        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {challenges
          .filter((c: any) =>
            c.name.toLowerCase().includes(search.toLowerCase())
          )
          .filter((c: any) =>
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
                bg-white
                border border-slate-200
                rounded-3xl
                shadow-sm
                hover:shadow-md
                transition-all duration-300
                p-5 space-y-4
              "
            >

              {/* Header */}
              <div className="flex justify-between items-start">

                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    {c.name}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    مدة التحدي{" "}
                    {Math.ceil(
                      (new Date(c.endDate).getTime() -
                        new Date(c.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    يوم
                  </p>
                </div>

                <span
                  className={`
                    px-3 py-1 rounded-full text-[11px] font-medium
                    ${
                      c.isActive
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                    }
                  `}
                >
                  {c.isActive ? "نشط" : "غير نشط"}
                </span>
              </div>

              {/* Dates */}
              <div className="space-y-2 text-sm text-slate-600">

                <div className="flex items-center justify-between">
                  <span>تاريخ البداية</span>

                  <span className="font-medium text-slate-800">
                    {c.startDate}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>تاريخ النهاية</span>

                  <span className="font-medium text-slate-800">
                    {c.endDate}
                  </span>
                </div>

              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">

              <button
  onClick={() => {
    if (c.isActive) {
      handleEnd(c.id);
    } else {
      handleActivate(c.id);
    }
  }}
  className={`
    flex-1 flex items-center justify-center gap-2 rounded-xl py-2 transition border
    ${c.isActive
      ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
      : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
    }
  `}
>
  {c.isActive ? <PowerOff size={16} /> : <Power size={16} />}
  {c.isActive ? "إيقاف" : "تفعيل"}
</button>


                {/* Edit */}
                <button
                  onClick={() => navigate(`/admin/challenges/edit/${c.id}`)}
                  className="
                    flex-1 py-2 rounded-xl
                    bg-blue-50
                    text-blue-700
                    text-sm font-semibold
                    hover:bg-blue-100
                    transition
                  "
                >
                  تعديل
                </button>

                {/* Delete */}
                <button
                  onClick={() => setDeleteTarget(c.id)}
                  className="
                    px-4 py-2 rounded-xl
                    bg-rose-50
                    text-rose-700
                    text-sm font-semibold
                    hover:bg-rose-100
                    transition
                  "
                >
                  حذف
                </button>

              </div>

            </div>
          ))}
      </div>

      {/* Delete Modal */}
      {deleteTarget !== null && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">

            <h2 className="text-xl font-bold text-slate-800 text-center">
              حذف التحدي
            </h2>

            <p className="text-center text-slate-500 mt-3 leading-relaxed">
              هل أنتِ متأكدة من حذف هذا التحدي؟
              <br />
              لا يمكن التراجع بعد الحذف.
            </p>

            <div className="flex gap-3 mt-6">

              <button
                onClick={async () => {
                  try {
                    const msg = await deleteChallenge(deleteTarget);

                    setMessage({
                      type: "success",
                      text: msg,
                    });

                    setChallenges((prev) =>
                      prev.filter((x: any) => x.id !== deleteTarget)
                    );

                  } catch {
                    setMessage({
                      type: "error",
                      text: "حدث خطأ أثناء الحذف",
                    });
                  }

                  setDeleteTarget(null);

                  setTimeout(() => {
                    setMessage(null);
                  }, 3000);
                }}
                className="
                  flex-1 py-2.5 rounded-2xl
                  bg-rose-500
                  text-white
                  text-sm font-semibold
                  hover:bg-rose-600
                  transition
                "
              >
                حذف
              </button>

              <button
                onClick={() => setDeleteTarget(null)}
                className="
                  flex-1 py-2.5 rounded-2xl
                  bg-slate-100
                  text-slate-700
                  text-sm font-semibold
                  hover:bg-slate-200
                  transition
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