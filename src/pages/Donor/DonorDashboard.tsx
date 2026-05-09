import { Button } from "@/components/ui/button";
import { Gift, Wallet, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DonorDonateOptions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-emerald-600 to-slate-900 flex items-center justify-center px-6">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl">
        
        <h1 className="text-3xl font-black text-white text-center mb-6">
          خيارات التبرع
        </h1>

        <p className="text-white/80 text-center mb-10">
          اختر نوع التبرع الذي ترغب بالمساهمة به
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* تبرع بوجبات */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center shadow-lg">
            <Utensils className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">تبرع بوجبات</h2>
            <p className="text-white/70 text-sm mb-4">
              ساهم في توفير وجبات جاهزة للمحتاجين
            </p>
            <Button
              onClick={() => navigate("/donor/donate/meals")}
              className="w-full bg-white text-emerald-900 font-black rounded-full"
            >
              اختر
            </Button>
          </div>

          {/* تبرع مالي */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center shadow-lg">
            <Wallet className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">تبرع مالي</h2>
            <p className="text-white/70 text-sm mb-4">
              ساعدنا في تمويل حملات الطعام
            </p>
            <Button
              onClick={() => navigate("/donor/donate/cash")}
              className="w-full bg-white text-emerald-900 font-black rounded-full"
            >
              اختر
            </Button>
          </div>

          {/* إهداء سند */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center shadow-lg">
            <Gift className="h-10 w-10 text-white mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">إهداء سند</h2>
            <p className="text-white/70 text-sm mb-4">
              أهدِ سند تبرع لشخص عزيز
            </p>
            <Button
              onClick={() => navigate("/donor/donate/gift")}
              className="w-full bg-white text-emerald-900 font-black rounded-full"
            >
              اختر
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
