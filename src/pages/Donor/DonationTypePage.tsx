import { DollarSign, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DonationTypePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-beige-50 to-white flex items-center justify-center p-8">
      <div className="max-w-5xl w-full">
        
        {/* Title */}
        <div className="text-center mb-8" dir="rtl">
          <h2 className="text-3xl text-green-800 mb-3">اختر نوع التبرع</h2>
          <p className="text-gray-600">اختر الطريقة التي تفضلها للمساهمة في التحدي</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Financial Donation */}
          <div className="bg-white rounded-2xl border-2 border-green-200 p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
            <div className="text-center">
              
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 mb-6 group-hover:scale-110 transition-transform">
                <DollarSign className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl text-green-800 mb-4" dir="rtl">
                تبرع مالي
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed" dir="rtl">
                ساهم بمبلغ مالي يومي لدعم الأسر المحتاجة وتوفير احتياجاتهم الأساسية خلال شهر رمضان المبارك
              </p>

              <div className="bg-green-50 rounded-lg p-4 mb-6" dir="rtl">
                <p className="text-sm text-green-700">
                  ✓ تبرع سريع ومباشر
                  <br />
                  ✓ حدد المبلغ المناسب لك
                  <br />
                  ✓ أثر فوري ومستدام
                </p>
              </div>

              <Button
                onClick={() => (window.location.href = "/donor/donate-cash-challenge")}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-xl"
              >
                اختر التبرع المالي
              </Button>
            </div>
          </div>

          {/* Voucher Donation */}
          <div className="bg-white rounded-2xl border-2 border-amber-200 p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
            <div className="text-center">
              
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 mb-6 group-hover:scale-110 transition-transform">
                <Ticket className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl text-amber-800 mb-4" dir="rtl">
                تبرع سندات طعام
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed" dir="rtl">
                وفر سندات غذائية للعائلات المحتاجة تمكنهم من الحصول على وجبات إفطار كريمة طوال شهر رمضان
              </p>

              <div className="bg-amber-50 rounded-lg p-4 mb-6" dir="rtl">
                <p className="text-sm text-amber-700">
                  ✓ تبرع عيني مباشر
                  <br />
                  ✓ سندات طعام جاهزة للاستخدام
                  <br />
                  ✓ دعم غذائي متكامل
                </p>
              </div>

              <Button
                onClick={() => (window.location.href = "/donor/donate-bond")}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6 rounded-xl"
              >
                اختر سندات الطعام
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
