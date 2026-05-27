import { useEffect, useState } from "react";
import { getActiveBondPrice, setBondPrice } from "@/api/GiftBond/giftBond";
import { Button } from "@/components/ui/button";

export default function BondPricePage() {
  const [price, setPrice] = useState<number | null>(null);
  const [newPrice, setNewPrice] = useState("");

  const loadPrice = async () => {
    try {
      const data = await getActiveBondPrice();
      setPrice(data.price);
    } catch {
      setPrice(null);
    }
  };

  useEffect(() => {
    loadPrice();
  }, []);

  const handleUpdate = async () => {
    await setBondPrice(Number(newPrice));
    setNewPrice("");
    await loadPrice();
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">سعر السند الحالي</h1>

      <p className="text-xl text-emerald-700 font-bold">
        {price ? `${price} ل.س` : "لا يوجد سعر مفعل"}
      </p>

      <div className="space-y-3">
        <input
          type="number"
          placeholder="السعر الجديد"
          className="border p-3 rounded-xl w-full"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />

        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
          onClick={handleUpdate}
        >
          تحديث السعر
        </Button>
      </div>
    </div>
  );
}
