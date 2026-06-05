import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Store, LogIn, UserPlus } from "lucide-react";

export default function StoreLogin() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isRegister, setIsRegister] = useState(false);

  const [storeName, setStoreName] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let result;

    try {
      if (isRegister) {
        // ⭐ إنشاء حساب متجر جديد
        result = await register(storeName, email, password, location, "store owner");
      } else {
        // ⭐ تسجيل دخول المتجر
        result = await login(email, password);
      }

      if (!result) {
        setError("❌ فشل العملية، تأكد من بياناتك");
        return;
      }

      if (result.role?.toLowerCase() !== "store owner") {
        setError("هذا الحساب ليس حساب متجر، قم بإنشاء حساب متجر أولاً");
        return;
      }

      navigate("/store/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء العملية");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-600 to-slate-900">
      <div className="w-full max-w-md rounded-[2rem] border border-white/20 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 mb-4 border border-white/30">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">Providing Food</h1>
          <p className="text-white/90 mt-2">Store Owner Portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {isRegister && (
            <>
              <Input
                placeholder="اسم المتجر"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50"
                required
              />

              <Input
                placeholder="موقع المتجر"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50"
                required
              />
            </>
          )}

          <Input
            type="email"
            placeholder="البريد الإلكتروني للمتجر"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50"
            required
          />

          <Input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50"
            required
          />

          {/* Submit */}
          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-full bg-white text-blue-900 hover:bg-slate-100 py-3 text-base font-black shadow-xl shadow-black/20 transition"
          >
            {isRegister ? (
              <>
                <UserPlus className="h-5 w-5" />
                إنشاء حساب متجر
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                تسجيل الدخول
              </>
            )}
          </Button>

          {error && <p className="text-rose-300 text-sm mt-2">{error}</p>}
        </form>

        {/* Toggle */}
        <div className="text-center mt-4">
          {isRegister ? (
            <span
              className="text-blue-200 cursor-pointer font-semibold hover:text-blue-100 transition"
              onClick={() => setIsRegister(false)}
            >
              لديك حساب متجر؟ تسجيل الدخول
            </span>
          ) : (
            <span
              className="text-blue-200 cursor-pointer font-semibold hover:text-blue-100 transition"
              onClick={() => setIsRegister(true)}
            >
              ليس لديك حساب متجر؟ إنشاء حساب
            </span>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-white/60">
          فقط أصحاب المتاجر يمكنهم الدخول
        </p>
      </div>
    </div>
  );
}
