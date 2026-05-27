import { useEffect, useState } from "react";
import { getActiveBondPrice, createGiftSession } from "@/api/GiftBond/giftBond";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DonateBondPage() {
  const navigate = useNavigate();

  const [price, setPrice] = useState<number | null>(null);
  const [count, setCount] = useState(1);

  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");

  const [loading, setLoading] = useState(false);

  // ⭐ تحميل سعر السند
  useEffect(() => {
    (async () => {
      try {
        const data = await getActiveBondPrice();
        setPrice(data.price);
      } catch {
        setPrice(null);
      }

      // ⭐ استرجاع بيانات محفوظة قبل تسجيل الدخول
      const saved = sessionStorage.getItem("pendingGift");
      if (saved) {
        const d = JSON.parse(saved);
        setCount(d.count);
        setRecipientName(d.recipientName);
        setRecipientPhone(d.recipientPhone);
        setRecipientAddress(d.recipientAddress);
      }
    })();
  }, []);

  // ⭐ التحقق من تسجيل الدخول
 const getToken = () => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  if (!user?.token) return null;
  return user.token;
};



  const handleDonate = async () => {
   const token = getToken();

if (!token) {
  sessionStorage.setItem(
    "pendingGift",
    JSON.stringify({
      count,
      recipientName,
      recipientPhone,
      recipientAddress,
    })
  );

  navigate("/donor/login?return=/donate-bond");
  return;
}

    

    // ⭐ إذا في تسجيل دخول → كمّل التبرّع
    const dto = {
      numberOfBonds: count,
      recipientName,
      recipientPhone,
      recipientAddress,
    };

    try {
      setLoading(true);
      const res = await createGiftSession(dto);

      // ⭐ تحويل لصفحة الدفع
      window.location.href = res.url;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold text-emerald-700">تبرّع بسند غذائي</h1>

      <p className="text-slate-600">
        يمكنك التبرّع بسند واحد أو عدة سندات، كما يمكنك إهداء السند لشخص أو
        عائلة تعرفها، والجمعية تتكفّل بإيصال الوجبات.
      </p>

      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 font-semibold">
        قيمة السند الحالي:{" "}
        <span className="font-black">{price ? `${price} ل.س` : "—"}</span>
      </div>

      {/* عدد السندات */}
      <div className="space-y-2">
        <label className="font-semibold text-slate-700">عدد السندات</label>
        <Input
          type="number"
          min={1}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="rounded-xl"
        />
      </div>

      {/* معلومات الشخص */}
      <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
        <h2 className="text-lg font-bold text-emerald-700">إهداء السند لشخص</h2>

        <Input
          placeholder="الاسم الكامل"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          className="rounded-xl"
        />

        <Input
          placeholder="رقم الهاتف"
          value={recipientPhone}
          onChange={(e) => setRecipientPhone(e.target.value)}
          className="rounded-xl"
        />

        <Input
          placeholder="العنوان"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          className="rounded-xl"
        />
      </div>

      {/* المجموع */}
      <div className="flex justify-between text-lg font-bold text-emerald-700">
        <span>المجموع:</span>
        <span>{price ? count * price : 0} ل.س</span>
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
