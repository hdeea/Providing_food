import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";

import { SeasonItem } from "@/types/SeasonItem";
import {
  getItemsBySeasonId,
  addItem,
  updateItem,
  deleteItem,
} from "@/api/Admin/season/seasonItems";

export default function SeasonItemsPage() {
  const { id } = useParams();
  const seasonId = Number(id);

  const location = useLocation();
  const seasonName = location.state?.seasonName || "الموسم";

  const [items, setItems] = useState<SeasonItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const [form, setForm] = useState<Partial<SeasonItem>>({
    name: "",
    description: "",
    price: 0,
  });

  const loadItems = async () => {
    setLoading(true);
    const data = await getItemsBySeasonId(seasonId);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (editMode && form.id) {
    await updateItem(form.id, form);
  } else {
    await addItem(seasonId, form);
  }

  setShowModal(false);
  setEditMode(false);
  setForm({ name: "", price: 0 });

  await loadItems(); 
};


  const handleDelete = async (id: number) => {
    await deleteItem(id);
    await loadItems();
  };

  return (
    <div className="p-8 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">
          عناصر موسم: {seasonName}
        </h1>

        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-md"
          onClick={() => {
            setEditMode(false);
            setForm({ name: "", description: "", price: 0 });
            setShowModal(true);
          }}
        >
          <Plus size={18} />
          إضافة عنصر
        </Button>
      </div>

      {loading && <p className="text-slate-500">جاري التحميل...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 p-6 space-y-5"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              {item.name}
            </h2>
            <p className="text-emerald-700 font-bold text-lg">
              السعر: {item.price} ل.س
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setEditMode(true);
                  setForm(item);
                  setShowModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-xl py-2 transition"
              >
                <Pencil size={16} />
                تعديل
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="flex items-center justify-center gap-2 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-xl px-3 py-2 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal
          title={editMode ? "تعديل عنصر" : "إضافة عنصر جديد"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-bold text-slate-700">اسم العنصر</label>
              <input
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

          

            <div>
              <label className="font-bold text-slate-700">السعر</label>
              <input
                type="number"
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
              />
            </div>

            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl">
              حفظ
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
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
