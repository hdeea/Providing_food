import { useState } from "react";
import { createShelterPost } from "@/api/Shelter/createPost";

export default function CreatePost({ shelter }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredMeals, setRequiredMeals] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("ShelterId", shelter.id);
    formData.append("Title", title);
    formData.append("Description", description);
    formData.append("RequiredMeals", requiredMeals);
    formData.append("DisplayImage", image);

    try {
      await createShelterPost(formData);

      alert("تم إنشاء المنشور بنجاح!");

      setTitle("");
      setDescription("");
      setRequiredMeals("");
      setImage(null);
    } catch (err) {
      alert("فشل إنشاء المنشور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-6 text-emerald-700">
        إنشاء منشور جديد
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block mb-1 font-semibold">عنوان المنشور</label>
          <input
            type="text"
            className="w-full border rounded-lg p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">الوصف</label>
          <textarea
            className="w-full border rounded-lg p-2 h-32"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-semibold">عدد الوجبات المطلوبة</label>
          <input
            type="number"
            className="w-full border rounded-lg p-2"
            value={requiredMeals}
            onChange={(e) => setRequiredMeals(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">صورة المنشور</label>
          <input
            type="file"
            accept="image/*"
            className="w-full"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "جاري الإرسال..." : "إنشاء المنشور"}
        </button>
      </form>
    </div>
  );
}
