import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function BeneficiaryRegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");
      const result = await register(fullName, email, password, phoneNumber, "Beneficiary");

      if (!result) {
        setError("فشل إنشاء الحساب");
        return;
      }

      setTimeout(() => navigate("/beneficiary/dashboard"), 100);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إنشاء الحساب");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-10 px-4">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg border border-green-200">

        <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
          إنشاء حساب مستفيد
        </h2>

        <div className="space-y-6">

          {/* Full Name */}
          <div>
            <label className="block mb-1 font-semibold text-green-700">الاسم الكامل</label>
            <input
              className="w-full border border-green-300 rounded-xl p-3"
              placeholder="أدخل اسمك الكامل"
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold text-green-700">البريد الإلكتروني</label>
            <input
              className="w-full border border-green-300 rounded-xl p-3"
              placeholder="example@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block mb-1 font-semibold text-green-700">رقم الهاتف</label>
            <input
              className="w-full border border-green-300 rounded-xl p-3"
              placeholder="09xxxxxxxx"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-semibold text-green-700">كلمة المرور</label>
            <input
              type="password"
              className="w-full border border-green-300 rounded-xl p-3"
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl text-lg font-semibold transition shadow-md"
          >
            إنشاء الحساب
          </button>

          {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}

          <p className="text-center text-green-700 mt-4">
            لديك حساب؟{" "}
            <Link to="/beneficiary/login" className="text-green-800 font-semibold">
              تسجيل الدخول
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
