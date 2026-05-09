import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

export default function DonateCash() {
  const { user } = useAuth();

  const [amount, setAmount] = useState("");
  const [region, setRegion] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
const handleDonate = async () => {
  setError("");
  setLoading(true);

  if (!amount || isNaN(parseFloat(amount.replace(",", ".")))) {
    setError("الرجاء إدخال مبلغ صالح");
    setLoading(false);
    return;
  }

  try {
    const response = await fetch("/api/payment/create-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({
        amount: parseFloat(amount.replace(",", ".")),
        regionName: region.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError("فشل إنشاء جلسة الدفع");
      setLoading(false);
      return;
    }

    window.location.href = data.url;

  } catch (err) {
    setError("حدث خطأ أثناء العملية");
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-700 via-emerald-600 to-slate-900 px-6">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl w-full max-w-md">

        <h1 className="text-3xl font-black text-white text-center mb-6">
          تبرع مالي
        </h1>

        <Input
          placeholder="أدخل المبلغ"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mb-4 bg-white/20 text-white placeholder:text-white/60"
        />

        <Input
          placeholder="اسم المنطقة"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="mb-4 bg-white/20 text-white placeholder:text-white/60"
        />

        <Button
          onClick={handleDonate}
          disabled={loading}
          className="w-full bg-white text-emerald-900 font-black rounded-full py-3"
        >
          {loading ? "جاري التحويل..." : "تبرع الآن"}
        </Button>

        {error && <p className="text-red-300 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}
