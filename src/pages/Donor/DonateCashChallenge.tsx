import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { createChallengePaymentSession } from "@/api/ramadanChallenge";

export default function DonateCashChallenge() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [region, setRegion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/donor/login?return=/donor/donate-cash-challenge", { replace: true });
    }
  }, [user, navigate]);

  const handleDonate = async () => {
    setError(null);

    const amountNumber = Number(amount);
    if (!amountNumber || amountNumber <= 0) {
      setError("الرجاء إدخال مبلغ صحيح أكبر من الصفر.");
      return;
    }

    if (!region.trim()) {
      setError("الرجاء تحديد المنطقة.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await createChallengePaymentSession(amountNumber, region.trim());
      window.location.href = data.url;
    } catch (err: any) {
      setError(err?.message || "حدث خطأ أثناء إنشاء جلسة الدفع.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-b from-green-50 to-white">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-xl" dir="rtl">
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
          التبرع المالي – تحدي 10 أيام خير
        </h1>

        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700">المبلغ اليومي</span>
            <input
              type="number"
              className="w-full mt-2 p-3 border rounded-xl"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="مثال: 50"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">المنطقة</span>
            <input
              type="text"
              className="w-full mt-2 p-3 border rounded-xl"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="مثال: التل"
            />
          </label>

          {error && <p className="text-rose-600">{error}</p>}

          <Button
            onClick={handleDonate}
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-lg"
          >
            {isSubmitting ? "جاري التوجيه إلى بوابة الدفع..." : "متابعة الدفع"}
          </Button>

          <button
            type="button"
            onClick={() => navigate("/donor/donation-type")}
            className="w-full border border-green-600 text-green-700 py-4 rounded-xl bg-white hover:bg-green-50"
          >
            العودة إلى أنواع التبرع
          </button>
        </div>
      </div>
    </div>
  );
}
