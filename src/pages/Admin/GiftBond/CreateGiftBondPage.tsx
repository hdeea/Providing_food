import { useState } from "react";
import { createGiftSession } from "@/api/GiftBond/giftBond";
import { Button } from "@/components/ui/button";

export default function CreateGiftBondPage() {
  const [form, setForm] = useState({
    numberOfBonds: 1,
    recipientName: "",
    recipientPhone: "",
    recipientAddress: ""
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const data = await createGiftSession(form);

    window.location.href = data.url; // الانتقال لبوابة الدفع
  };

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">إهداء سند</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="border p-3 rounded-xl w-full"
          placeholder="اسم المستلم"
          value={form.recipientName}
          onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
        />

        <input
          className="border p-3 rounded-xl w-full"
          placeholder="رقم الهاتف"
          value={form.recipientPhone}
          onChange={(e) => setForm({ ...form, recipientPhone: e.target.value })}
        />

        <input
          className="border p-3 rounded-xl w-full"
          placeholder="العنوان"
          value={form.recipientAddress}
          onChange={(e) => setForm({ ...form, recipientAddress: e.target.value })}
        />

        <input
          type="number"
          className="border p-3 rounded-xl w-full"
          placeholder="عدد السندات"
          value={form.numberOfBonds}
          onChange={(e) =>
            setForm({ ...form, numberOfBonds: Number(e.target.value) })
          }
        />

        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">
          متابعة للدفع
        </Button>
      </form>
    </div>
  );
}
