import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function BeneficiaryLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
const handleLogin = async () => {
  try {
    setError("");
    const result = await login(email, password);

    if (!result) {
      setError("فشل تسجيل الدخول، تأكد من البيانات");
      return;
    }

    if (result.role?.toLowerCase() !== "beneficiary") {
      setError("هذا الحساب ليس حساب مستفيد");
      return;
    }

    setTimeout(() => navigate("/beneficiary/dashboard"), 100);
  } catch (err: any) {
    setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-green-200">

        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          تسجيل الدخول
        </h2>

        <div className="space-y-5">

          <div>
            <label className="block mb-1 font-semibold text-green-700">البريد الإلكتروني</label>
            <input
              type="email"
              className="w-full border border-green-300 rounded-xl p-3 focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="example@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-green-700">كلمة المرور</label>
            <input
              type="password"
              className="w-full border border-green-300 rounded-xl p-3 focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl text-lg font-semibold shadow-md"
          >
            تسجيل الدخول
          </button>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <p className="text-center text-sm text-gray-600">
            ليس لديك حساب؟
            <Link to="/beneficiary/register" className="text-green-700 font-semibold mx-1">
              إنشاء حساب
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
