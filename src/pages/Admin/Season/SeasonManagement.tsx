import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  Power,
  PowerOff,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getAllSeasons } from "@/api/Admin/season/getAllSeasons";
import { createSeason } from "@/api/Admin/season/createSeason";
import { updateSeason } from "@/api/Admin/season/updateSeason";
import { deleteSeason } from "@/api/Admin/season/deleteSeason";
import { activateSeason } from "@/api/Admin/season/activateSeason";
import { deactivateSeason } from "@/api/Admin/season/deactivateSeason";

export default function SeasonManagementPage() {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    startDate: "",
    endDate: ""
  });
const navigate = useNavigate();

  const loadSeasons = async () => {
    setLoading(true);
    const data = await getAllSeasons();
    setSeasons(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadSeasons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createSeason(form);
    setShowCreateModal(false);
    await loadSeasons();
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    await updateSeason(form.id, form);
    setShowEditModal(false);
    await loadSeasons();
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا الموسم؟")) return;
    await deleteSeason(id);
    await loadSeasons();
  };

  /* -------------------------------------------------------
     ⭐ منطق التفعيل الجديد — يسمح بموسم واحد فقط مفعّل
     ------------------------------------------------------- */
 const toggleSeason = async (season) => {
  // إذا الموسم الحالي مفعّل → فقط أوقفيه
  if (season.isActive) {
    await deactivateSeason(season.id);
    await loadSeasons();
    return;
  }

  // إذا في موسم آخر مفعّل → أوقفيه أولاً
  const activeSeason = seasons.find((s) => s.isActive);

  if (activeSeason && activeSeason.id !== season.id) {
    await deactivateSeason(activeSeason.id);
  }

  // فعّلي الموسم الجديد
  await activateSeason(season.id);

  // تحديث القائمة
  await loadSeasons();
};


  return (
    <div className="p-8 space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            إدارة المواسم
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            تحكم كامل بالمواسم – إنشاء، تعديل، تفعيل، إيقاف، حذف
          </p>
        </div>

        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-md"
          onClick={() => {
            setForm({ id: null, name: "", description: "", startDate: "", endDate: "" });
            setShowCreateModal(true);
          }}
        >
          + موسم جديد
        </Button>
      </div>

      {/* LOADING */}
      {loading && <p className="text-slate-500">جاري التحميل...</p>}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
        {seasons.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 p-6 space-y-5 group"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-slate-900 group-hover:text-emerald-700 transition">
                  {s.name}
                </h2>
                <p className="text-slate-500 text-sm">{s.description}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                  s.isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {s.isActive ? "نشط" : "غير نشط"}
              </span>
            </div>

            {/* DATES */}
            <div className="flex items-center gap-3 text-slate-600 text-sm">
              <CalendarDays size={18} className="text-slate-400" />
              <div>
                <p>من: {s.startDate?.split("T")[0]}</p>
                <p>إلى: {s.endDate?.split("T")[0]}</p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 pt-2">

              {/* EDIT */}
              <button
                onClick={() => {
                  setForm({
                    id: s.id,
                    name: s.name,
                    description: s.description,
                    startDate: s.startDate?.split("T")[0],
                    endDate: s.endDate?.split("T")[0]
                  });
                  setShowEditModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-xl py-2 transition"
              >
                <Pencil size={16} />
                تعديل
              </button>
<button
  onClick={() => navigate(`/admin/seasons/${s.id}/items`, { state: { seasonName: s.name } })}
  className="flex-1 flex items-center justify-center gap-2 bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 rounded-xl py-2 transition"
>
  العناصر
</button>

              {/* ACTIVATE / DEACTIVATE */}
              <button
                onClick={() => toggleSeason(s)}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 transition border ${
                  s.isActive
                    ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                {s.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                {s.isActive ? "إيقاف" : "تفعيل"}
              </button>

              {/* DELETE */}
              <button
                onClick={() => handleDelete(s.id)}
                className="flex items-center justify-center gap-2 bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 rounded-xl px-3 py-2 transition"
              >
                <Trash2 size={16} />
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <Modal title="إنشاء موسم جديد" onClose={() => setShowCreateModal(false)}>
          <SeasonForm form={form} setForm={setForm} onSubmit={handleCreate} />
        </Modal>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <Modal title="تعديل الموسم" onClose={() => setShowEditModal(false)}>
          <SeasonForm form={form} setForm={setForm} onSubmit={handleEdit} />
        </Modal>
      )}

    </div>
  );
}

/* ---------------------- MODAL ---------------------- */

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-7 w-full max-w-lg shadow-xl space-y-5 animate-fadeIn">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        {children}
        <Button className="w-full bg-slate-200 hover:bg-slate-300" onClick={onClose}>
          إغلاق
        </Button>
      </div>
    </div>
  );
}

/* ---------------------- FORM ---------------------- */

function SeasonForm({ form, setForm, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">

      <div>
        <label className="font-bold text-slate-700">اسم الموسم</label>
        <input
          className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div>
        <label className="font-bold text-slate-700">الوصف</label>
        <input
          className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div>
        <label className="font-bold text-slate-700">تاريخ البداية</label>
        <input
          type="date"
          className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />
      </div>

      <div>
        <label className="font-bold text-slate-700">تاريخ النهاية</label>
        <input
          type="date"
          className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />
      </div>

      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl">
        حفظ
      </Button>

    </form>
  );
}
