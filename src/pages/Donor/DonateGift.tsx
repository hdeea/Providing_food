import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

export default function DonateGift() {
  const { user } = useAuth();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const donate = async () => {
    const response = await fetch("/api/Challenge/payment-gift-bonds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donorId: user?.id,
        recipientName: recipient,
        amount: Number(amount),
      }),
    });

    const data = await response.json();
    setMessage(data.message || "تم إرسال السند بنجاح");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-700">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-black text-emerald-700 mb-6 text-center">
          إهداء سند
        </h1>

        <Input
          placeholder="اسم الشخص المُهدى إليه"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="mb-4"
        />

        <Input
          placeholder="قيمة السند"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mb-4"
        />

        <Button onClick={donate} className="w-full bg-emerald-700 text-white">
          إرسال السند
        </Button>

        {message && <p className="text-center mt-4 text-emerald-700">{message}</p>}
      </div>
    </div>
  );
}
