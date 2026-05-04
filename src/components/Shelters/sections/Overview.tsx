import { FileText, Heart, ShieldCheck } from "lucide-react";

export default function Overview({ postsCount, donationsCount, shelter }) {
  const status = shelter?.status || "Pending";

  const statusConfig = {
    Approved: {
      label: "تمت الموافقة",
      color: "bg-emerald-100 text-emerald-700",
      icon: <ShieldCheck className="h-8 w-8 text-emerald-700" />,
      border: "border-emerald-200",
      gradient: "from-emerald-50 to-white",
    },
    Pending: {
      label: "قيد المراجعة",
      color: "bg-amber-100 text-amber-700",
      icon: <ShieldCheck className="h-8 w-8 text-amber-700" />,
      border: "border-amber-200",
      gradient: "from-amber-50 to-white",
    },
    Rejected: {
      label: "مرفوض",
      color: "bg-rose-100 text-rose-700",
      icon: <ShieldCheck className="h-8 w-8 text-rose-700" />,
      border: "border-rose-200",
      gradient: "from-rose-50 to-white",
    },
  };

  const ui = statusConfig[status];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-emerald-700">نظرة عامة</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* عدد المنشورات */}
        <div className={`rounded-[2rem] border ${"border-emerald-200"} bg-gradient-to-br from-emerald-50 to-white p-6 shadow-lg hover:shadow-xl transition`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                Posts
              </p>
              <p className="text-4xl font-black text-slate-900 mt-2">{postsCount}</p>
              <p className="text-xs text-slate-500 mt-1">عدد المنشورات</p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
              <FileText className="h-8 w-8 text-emerald-700" />
            </div>
          </div>
        </div>

        {/* عدد التبرعات */}
        <div className="rounded-[2rem] border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-lg hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Donations
              </p>
              <p className="text-4xl font-black text-slate-900 mt-2">{donationsCount}</p>
              <p className="text-xs text-slate-500 mt-1">عدد التبرعات</p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
              <Heart className="h-8 w-8 text-blue-700" />
            </div>
          </div>
        </div>

        {/* حالة الملجأ */}
        <div className={`rounded-[2rem] border ${ui.border} bg-gradient-to-br ${ui.gradient} p-6 shadow-lg hover:shadow-xl transition`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Shelter Status
              </p>
              <p className="text-3xl font-black text-slate-900 mt-2">{ui.label}</p>
              <p className="text-xs text-slate-500 mt-1">حالة الاعتماد</p>
            </div>

            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${ui.color}`}>
              {ui.icon}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
