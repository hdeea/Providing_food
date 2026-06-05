import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Heart, LogIn, UserPlus } from "lucide-react";

export default function ShelterLogin() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    let result;
    if (isRegister) {
      result = await register(fullName, email, password, phoneNumber);
    } else {
      result = await login(email, password);
    }

    if (!result) {
      setError(" فشل العملية، تأكد من بياناتك");
      return;
    }

    if (result.role?.toLowerCase() !== "shelter owner") {
      setError("هذا الحساب ليس حساب ملجأ، قم بإنشاء حساب جديد أولاً");
      return;
    }

    //  بعد التسجيل أو تسجيل الدخول، روح إلى صفحة الملجأ الرئيسية لتحديد الحالة
setTimeout(() => navigate("/shelter/dashboard"), 100);
  } catch (err: any) {
    setError(err.message || "حدث خطأ أثناء العملية");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-700 via-emerald-600 to-slate-900">
      <div className="w-full max-w-md rounded-[2rem] border border-white/20 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 mb-4 border border-white/30">
            <Heart className="h-8 w-8 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-black text-white">Providing Food</h1>
          <p className="text-white/90 mt-2">Shelter Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <Input
                placeholder="الاسم الكامل"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50"
                required
              />
              <Input
                placeholder="رقم الهاتف"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50"
              />
            </>
          )}

          <Input
            type="email"
            placeholder="البريد الإلكتروني"
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

          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-full bg-white text-emerald-900 hover:bg-slate-100 py-3 text-base font-black shadow-xl shadow-black/20 transition"
          >
            {isRegister ? (
              <>
                <UserPlus className="h-5 w-5" />
                إنشاء حساب
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                تسجيل الدخول
              </>
            )}
          </Button>

          {error && <p className="text-rose-300 text-sm mt-2">{error}</p>}

          <div className="text-center mt-3">
            {isRegister ? (
              <span
                className="text-emerald-300 cursor-pointer font-semibold hover:text-emerald-200 transition"
                onClick={() => setIsRegister(false)}
              >
                لديك حساب بالفعل؟ تسجيل الدخول
              </span>
            ) : (
              <span
                className="text-emerald-300 cursor-pointer font-semibold hover:text-emerald-200 transition"
                onClick={() => setIsRegister(true)}
              >
                ليس لديك حساب؟ إنشاء حساب
              </span>
            )}
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-white/60">
          فقط أصحاب الملاجئ المعتمدين يمكنهم الدخول
        </p>
      </div>
    </div>
  );
}
