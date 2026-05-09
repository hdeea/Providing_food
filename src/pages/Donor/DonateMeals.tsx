import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

export default function DonateMeals() {
  const { user } = useAuth();
  const [meals, setMeals] = useState("");
  const [message, setMessage] = useState("");

  const donate = async () => {
    const response = await fetch("/api/Challenge/payment-cash-donation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donorId: user?.id,
        amount: Number(meals) * 3, // مثال: كل وجبة = 3$
      }),
    });

    const data = await response.json();
    setMessage(data.message || "تم التبرع بالوجبات بنجاح");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-700">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-black text-emerald-700 mb-6 text-center">
          تبرع بوجبات
        </h1>

        <Input
          placeholder="عدد الوجبات"
          value={meals}
          onChange={(e) => setMeals(e.target.value)}
          className="mb-4"
        />

        <Button onClick={donate} className="w-full bg-emerald-700 text-white">
          تبرع الآن
        </Button>

        {message && <p className="text-center mt-4 text-emerald-700">{message}</p>}
      </div>
    </div>
  );
}
