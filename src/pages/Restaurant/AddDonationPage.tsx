import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { postDonation } from "@/api/Restaurant/postDonation";

export default function AddDonationPage() {
  const { user } = useAuth();

  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("restaurant");

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!quantity.trim()) return setError("عدد الوجبات مطلوب");
    if (isNaN(Number(quantity)) || Number(quantity) <= 0)
      return setError("عدد الوجبات يجب أن يكون رقماً صحيحاً");
    if (!date.trim()) return setError("تاريخ التبرع مطلوب");

    const restaurantName = sessionStorage.getItem("restaurantName");

    if (!restaurantName) {
      return setError("لا يمكن إرسال التبرع قبل الموافقة على حساب المطعم");
    }

    const formData = {
      Quantity: quantity,
      DateDonated: date,
      RestaurantName: restaurantName,
      DeliveryLocation: location,
    };

    try {
      const result = await postDonation(user.token, formData);

      setMsg("تم إضافة التبرع بنجاح 🎉");
      setQuantity("");
      setDate("");
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إرسال التبرع");
    }
  }; // ← إغلاق دالة handleSubmit بشكل صحيح

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-emerald-100">
      <h1 className="text-2xl font-bold text-emerald-700 mb-6">
        إضافة تبرع جديد 🍽️
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-emerald-700 font-medium">
            عدد الوجبات
          </label>
          <Input
            placeholder="مثال: 10"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-emerald-700 font-medium">
            تاريخ التبرع
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 text-emerald-700 font-medium">
            مكان الاستلام
          </label>

          <div className="flex gap-6 text-gray-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="Resturant"
                checked={location === "Resturant"}
                onChange={() => setLocation("Resturant")}
              />
              المطعم
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="Charity"
                checked={location === "charity"}
                onChange={() => setLocation("charity")}
              />
              الجمعية
            </label>
          </div>
        </div>

        {error && <p className="text-red-500 font-semibold">{error}</p>}
        {msg && <p className="text-green-600 font-semibold">{msg}</p>}

        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg">
          إضافة التبرع
        </Button>
      </form>
    </div>
  );
}
