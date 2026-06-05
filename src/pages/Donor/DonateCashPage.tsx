import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function DonateCashPage() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [regionName, setRegionName] = useState("");
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    return user?.token || null;
  };

  const handleDonate = async () => {
    const token = getToken();

    // إذا ما في تسجيل دخول → رجّعي المستخدم للّوغين
    if (!token) {
      sessionStorage.setItem(
        "pendingCashDonation",
        JSON.stringify({ amount, regionName })
      );

      navigate("/donor/login?return=/donate-cash");
      return;
    }

    const dto = {
      amount: Number(amount),
      regionName,
    };

    try {
      setLoading(true);

      const res = await fetch(`/api/payment/create-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      });

      if (!res.ok) throw new Error("Failed to create session");

      const data = await res.json();

      // تحويل لصفحة الدفع
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold text-emerald-700">تبرّع مالي</h1>

      <p className="text-slate-600">
        يمكنك التبرّع بمبلغ مالي، وسيتم توجيهه مباشرة لدعم المحتاجين عبر منصة Providing Food.
      </p>

      {/* مبلغ التبرع */}
      <div className="space-y-2">
        <label className="font-semibold text-slate-700">المبلغ (ل.س)</label>
        <Input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded-xl"
        />
      </div>

      {/* المنطقة */}
      <div className="space-y-2">
        <label className="font-semibold text-slate-700">المنطقة</label>
        <Input
          placeholder="مثال: المرجة"
          value={regionName}
          onChange={(e) => setRegionName(e.target.value)}
          className="rounded-xl"
        />
      </div>

      {/* زر الدفع */}
      <Button
        onClick={handleDonate}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
      >
        {loading ? "جاري المعالجة..." : "متابعة الدفع"}
      </Button>
    </div>
  );
}
