import { useState } from "react";
import { createShelterPost } from "@/api/Shelter/createPost";
import { ImagePlus } from "lucide-react";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredMeals, setRequiredMeals] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("requiredMeals", requiredMeals);
formData.append("DisplayImage", image);

    const result = await createShelterPost(formData);

    if (result) {
      setSuccess("✔ تم إنشاء المنشور بنجاح");
      setTitle("");
      setDescription("");
      setRequiredMeals("");
      setImage(null);
      setPreview(null);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md border border-emerald-200">

      <h1 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
        إنشاء منشور جديد
      </h1>

      {success && (
        <p className="text-emerald-600 font-semibold mb-4 text-center">
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            عنوان المنشور
          </label>
          <input
            type="text"
            className="w-full border border-emerald-300 rounded-lg p-3 focus:ring-emerald-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            الوصف
          </label>
          <textarea
            className="w-full border border-emerald-300 rounded-lg p-3 h-24 focus:ring-emerald-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            عدد الوجبات المطلوبة
          </label>
          <input
            type="number"
            className="w-full border border-emerald-300 rounded-lg p-3 focus:ring-emerald-500"
            value={requiredMeals}
            onChange={(e) => setRequiredMeals(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            صورة المنشور
          </label>

          <div className="border-2 border-dashed border-emerald-300 rounded-xl p-4 text-center hover:bg-emerald-50 transition cursor-pointer">
            <label className="cursor-pointer flex flex-col items-center">
              <ImagePlus className="w-8 h-8 text-emerald-600 mb-1" />
              <span className="text-emerald-700 text-sm font-semibold">
                اضغط لاختيار صورة
              </span>
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>

          {preview && (
            <img
              src={preview}
              className="w-full h-40 object-cover rounded-lg mt-3 shadow"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "جاري الإنشاء..." : "إنشاء المنشور"}
        </button>
      </form>
    </div>
  );
}
