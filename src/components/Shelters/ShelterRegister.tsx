import { useState } from "react";
import { registerShelter } from "@/api/Shelter/registerShelter";

export default function ShelterRegister({ onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!proof) {
      setError("يرجى اختيار صورة إثبات");
      return;
    }

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Description", description);
    formData.append("ProofImage", proof);

    try {
      setLoading(true);
      await registerShelter(formData);

      if (onSuccess) onSuccess(); // ← الانتقال لصفحة حالة الطلب
    } catch {
      setError("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-2">تسجيل ملجأ جديد 🏠</h2>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">اسم الملجأ</label>
        <input
          type="text"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="مثال: ملجأ الأمل"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">الوصف</label>
        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="اكتب وصف الملجأ ومهمته"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          صورة الإثبات 📷
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProof(e.target.files?.[0] || null)}
          className="w-full text-sm"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold disabled:opacity-60"
      >
        {loading ? "جاري إرسال الطلب..." : "إرسال الطلب 🏢"}
      </button>
    </form>
  );
}
