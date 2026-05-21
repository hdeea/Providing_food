import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function SendJoinRequestPage() {
  const { user } = useAuth();

  const [restaurantName, setRestaurantName] = useState(user?.fullName || "");
  const [restaurantEmail, setRestaurantEmail] = useState(user?.email || "");
  const [restaurantPhone, setRestaurantPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [licenseImage, setLicenseImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

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
          Authorization: `Bearer ${user?.token}`
        },
        body: formData
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

    } catch (err: any) {
      setError("حدث خطأ أثناء إرسال الطلب");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-emerald-200">

      <h1 className="text-2xl font-bold text-emerald-700 mb-6">طلب الانضمام</h1>

      <div className="space-y-4">

        <input
          className="w-full p-3 border rounded"
          placeholder="اسم المطعم"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
        />

        <input
          className="w-full p-3 border rounded"
          placeholder="البريد الإلكتروني"
          value={restaurantEmail}
          onChange={(e) => setRestaurantEmail(e.target.value)}
        />

        <input
          className="w-full p-3 border rounded"
          placeholder="رقم الهاتف"
          value={restaurantPhone}
          onChange={(e) => setRestaurantPhone(e.target.value)}
        />

        <input
          className="w-full p-3 border rounded"
          placeholder="العنوان"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <textarea
          className="w-full p-3 border rounded"
          placeholder="وصف المطعم"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setLicenseImage(e.target.files?.[0] || null)}
        />

        {error && <p className="text-red-500 font-semibold">{error}</p>}
        {msg && <p className="text-green-600 font-semibold">{msg}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg text-lg"
        >
          {loading ? "جاري الإرسال..." : "إرسال طلب الانضمام"}
        </button>
      </div>
    </div>
  );
}
