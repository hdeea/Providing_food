import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function RestaurantLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);

    if (!result) {
      setError("فشل تسجيل الدخول، تأكد من البيانات");
      return;
    }

    // التحقق من الدور
    if (result.role?.toLowerCase() !== "restaurant") {
      setError("هذا البريد غير مخصص لحساب مطعم");
      return;
    }

    // نجاح
    setTimeout(() => navigate("/restaurant/dashboard"), 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 border border-emerald-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-emerald-700">
          دخول المطاعم
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-emerald-300 focus:ring-emerald-500"
            required
          />

          <Input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-emerald-300 focus:ring-emerald-500"
            required
          />

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold"
          >
            تسجيل الدخول
          </Button>

          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
