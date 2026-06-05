import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-beige-50 to-white flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        
        {/* Decorative Elements */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="text-6xl">🌙</div>
            <Sparkles className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-xl p-8 md:p-12 relative overflow-hidden">
          
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="currentColor" />
              </pattern>
              <rect width="100" height="100" fill="url(#pattern)" />
            </svg>
          </div>

          <div className="relative z-10">
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl text-center mb-6 text-green-800" dir="rtl">
              تحدي 10 أيام خير في رمضان
            </h1>

            {/* Description */}
            <div className="bg-gradient-to-r from-green-50 to-amber-50 rounded-xl p-6 mb-8" dir="rtl">
              <p className="text-lg text-gray-700 text-center leading-relaxed mb-4">
                شارك معنا في رحلة روحانية مميزة خلال شهر رمضان المبارك
              </p>
              <p className="text-base text-gray-600 text-center leading-relaxed">
                تبرع لمدة 10 أيام متتالية واحصل على نقاط التحدي. كل يوم تبرع فيه يقربك خطوة نحو إكمال التحدي
                والحصول على شارة "أكملت التحدي". اختر بين التبرع المالي أو سندات الطعام لمساعدة المحتاجين.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100" dir="rtl">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-sm text-green-800">تتبع تقدمك اليومي</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-100" dir="rtl">
                <div className="text-3xl mb-2">⭐</div>
                <p className="text-sm text-amber-800">اكسب نقاط التحدي</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100" dir="rtl">
                <div className="text-3xl mb-2">🏆</div>
                <p className="text-sm text-purple-800">احصل على الشارة</p>
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <Button
                onClick={() => console.log("start challenge")}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-lg px-12 py-6 rounded-xl shadow-lg"
              >
                <Sparkles className="w-5 h-5 ml-2" />
                ابدأ التحدي
              </Button>
            </div>

            {/* Bottom decoration */}
            <div className="mt-8 flex justify-center items-center gap-3 opacity-30">
              <span className="text-2xl">✨</span>
              <span className="text-2xl">🕌</span>
              <span className="text-2xl">✨</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
