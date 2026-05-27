import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, Mail, Phone, MapPin, FileImage } from "lucide-react";

export default function SendJoinRequestPage() {
  const { user } = useAuth();

  const [restaurantName, setRestaurantName] = useState(user?.fullName || "");
  const [restaurantEmail, setRestaurantEmail] = useState(user?.email || "");
  const [restaurantPhone, setRestaurantPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [licenseImage, setLicenseImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLicenseImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMsg("");
    setError("");

    if (!licenseImage) {
      setError("يجب رفع صورة الترخيص");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("RestaurantName", restaurantName);
    formData.append("RestaurantEmail", restaurantEmail);
    formData.append("RestaurantPhone", restaurantPhone);
    formData.append("Address", address);
    formData.append("Description", description);
    formData.append("LicenseImage", licenseImage);

    try {
      const response = await fetch("/api/Restaurant/join-request", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        setError("خطأ: " + text);
        setLoading(false);
        return;
      }

      setMsg("تم إرسال طلب الانضمام بنجاح");
      setTimeout(() => {
        window.location.href = "/restaurant/dashboard";
      }, 1200);
    } catch (err) {
      setError("حدث خطأ أثناء إرسال الطلب");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-10 px-4" dir="rtl">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-700 rounded-full mb-3 shadow-lg">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">طلب انضمام مطعم</h1>
          <p className="text-slate-600 mt-1 text-sm">قم بتعبئة النموذج لإرسال طلب الانضمام</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6">

          {/* Restaurant Name */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
              <Building2 className="w-4 h-4 text-emerald-700" />
              اسم المطعم
            </label>
            <input
              className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm"
              placeholder="مثال: مطعم الشام"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
              <Mail className="w-4 h-4 text-emerald-700" />
              البريد الإلكتروني
            </label>
            <input
              className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm"
              placeholder="example@email.com"
              value={restaurantEmail}
              onChange={(e) => setRestaurantEmail(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
              <Phone className="w-4 h-4 text-emerald-700" />
              رقم الهاتف
            </label>
            <input
              className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm"
              placeholder="0900000000"
              value={restaurantPhone}
              onChange={(e) => setRestaurantPhone(e.target.value)}
            />
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
              <MapPin className="w-4 h-4 text-emerald-700" />
              العنوان
            </label>
            <input
              className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm"
              placeholder="المدينة - المنطقة - الشارع"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
              <Building2 className="w-4 h-4 text-emerald-700" />
              وصف المطعم
            </label>
            <textarea
              className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm"
              placeholder="اكتب وصفاً مختصراً..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Upload Box */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
              <FileImage className="w-4 h-4 text-emerald-700" />
              صورة الترخيص
            </label>

            <label
              htmlFor="license-image"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition"
            >
              <FileImage className="w-8 h-8 text-slate-500 mb-2" />
              <p className="text-xs text-slate-600">
                <span className="font-semibold">اضغط للرفع</span> صورة الترخيص
              </p>
              <p className="text-[10px] text-slate-500">PNG, JPG, JPEG</p>

              <input
                id="license-image"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 h-24 w-24 rounded-lg object-cover border shadow"
              />
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-full text-sm"
          >
            {loading ? "جاري الإرسال..." : "إرسال طلب الانضمام"}
          </button>

          {error && <p className="text-red-500 font-semibold text-sm">{error}</p>}
          {msg && <p className="text-green-600 font-semibold text-sm">{msg}</p>}

          <p className="text-xs text-slate-500 text-center pt-1">
            سيتم التواصل معك خلال 24 ساعة بعد مراجعة الطلب.
          </p>
        </div>
      </div>
    </div>
  );
}
