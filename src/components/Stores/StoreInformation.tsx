import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Store, MapPin, Phone, Package } from "lucide-react";
import { addStoreRequest } from "@/api/Store/addStoreRequest";

export function StoreInformation() {
  const [storeData, setStoreData] = useState({
    storeName: "",
    storeLocation: "",
    phoneNumber: "",
    basketCount: 0,
    basketContents: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addStoreRequest(storeData);
      alert("تم إرسال طلب المتجر بنجاح!");
    } catch (error) {
      alert("حدث خطأ أثناء إرسال الطلب");
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6" dir="rtl">
        <Store className="w-8 h-8 text-green-600" />
        <h2 className="text-2xl text-gray-900">طلب متجر جديد</h2>
      </div>

      <div className="bg-white rounded-xl border border-green-100 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Store Name */}
          <div className="space-y-2" dir="rtl">
            <Label className="text-base text-gray-700">اسم المتجر</Label>
            <Input
              type="text"
              value={storeData.storeName}
              onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
              placeholder="أدخل اسم المتجر"
              required
            />
          </div>

          {/* Store Location */}
          <div className="space-y-2" dir="rtl">
            <Label className="text-base text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              موقع المتجر
            </Label>
            <Input
              type="text"
              value={storeData.storeLocation}
              onChange={(e) => setStoreData({ ...storeData, storeLocation: e.target.value })}
              placeholder="أدخل عنوان المتجر"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2" dir="rtl">
            <Label className="text-base text-gray-700 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              رقم الهاتف
            </Label>
            <Input
              type="tel"
              value={storeData.phoneNumber}
              onChange={(e) => setStoreData({ ...storeData, phoneNumber: e.target.value })}
              placeholder="أدخل رقم الهاتف"
              required
              dir="ltr"
            />
          </div>

          {/* Basket Count */}
          <div className="space-y-2" dir="rtl">
            <Label className="text-base text-gray-700 flex items-center gap-2">
              <Package className="w-4 h-4" />
              عدد السلال
            </Label>
            <Input
              type="number"
              value={storeData.basketCount}
              onChange={(e) => setStoreData({ ...storeData, basketCount: Number(e.target.value) })}
              placeholder="أدخل عدد السلال"
              required
            />
          </div>

          {/* Basket Contents */}
          <div className="space-y-2" dir="rtl">
            <Label className="text-base text-gray-700">محتوى السلة</Label>
            <Textarea
              value={storeData.basketContents}
              onChange={(e) => setStoreData({ ...storeData, basketContents: e.target.value })}
              placeholder="أدخل محتوى السلة"
              rows={4}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              إرسال الطلب
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
