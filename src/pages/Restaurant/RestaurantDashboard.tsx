import { useEffect, useState } from "react";
import RestaurantLayout from "./RestaurantLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  BarChart3,
  FileText,
  PlusCircle,
  List,
  CheckCircle,
  Clock,
  TrendingUp,
  Layers
} from "lucide-react";

// API لجلب حالة المطعم
async function getRestaurantStatus(token: string) {
  const response = await fetch("/api/admin/my-request", {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) return null;

  const text = await response.text();
  if (!text) return null;

  return JSON.parse(text);
}

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const [status, setStatus] = useState<"none" | "pending" | "approved" | null>(null);

  // بيانات الإحصائيات (مؤقتة – لاحقاً نربطها بالـ API)
  const stats = {
    donations: 12,
    posts: 5,
    received: 7,
    monthly: 4
  };

  useEffect(() => {
    if (!user) return;

    async function fetchStatus() {
      const data = await getRestaurantStatus(user.token);

      if (!data) {
        setStatus("none");
        return;
      }

      if (data.status === "Pending") {
        setStatus("pending");
      } else if (data.status === "Approved") {
        setStatus("approved");

        sessionStorage.setItem("restaurantName", data.restaurantName);
        sessionStorage.setItem("restaurantId", data.restaurantId);
      } else {
        setStatus("none");
      }
    }

    fetchStatus();
  }, [user]);

  // ------------------ حالة: لم يرسل طلب انضمام ------------------
  if (status === "none") {
    return (
      <RestaurantLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="bg-white p-10 rounded-2xl shadow-lg text-center border border-emerald-200">
            <h1 className="text-2xl font-bold text-emerald-700 mb-4">لم يتم تقديم طلب انضمام</h1>
            <p className="text-gray-700 mb-6">يجب تقديم طلب انضمام قبل استخدام النظام.</p>

            <Link
              to="/restaurant/join-request"
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
            >
              تقديم طلب انضمام
            </Link>
          </div>
        </div>
      </RestaurantLayout>
    );
  }

  // ------------------ حالة: Pending ------------------
  if (status === "pending") {
    return (
      <RestaurantLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="bg-white p-10 rounded-2xl shadow-lg text-center border border-emerald-200">
            <h1 className="text-2xl font-bold text-emerald-700 mb-4">طلبك قيد الانتظار</h1>
            <p className="text-gray-700">
              تم إرسال طلب الانضمام. الرجاء انتظار موافقة الإدارة.
            </p>
          </div>
        </div>
      </RestaurantLayout>
    );
  }

  // ------------------ حالة: Approved → عرض الداشبورد الكامل ------------------
  return (
    <RestaurantLayout>
      <h1 className="text-3xl font-bold text-emerald-700 mb-10">
        مرحباً {user?.fullName} 👋
      </h1>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <StatCard
          title="إجمالي التبرعات"
          value={stats.donations}
          icon={<Layers className="w-8 h-8 text-emerald-600" />}
        />

        <StatCard
          title="منشورات الملاجئ"
          value={stats.posts}
          icon={<FileText className="w-8 h-8 text-blue-600" />}
        />

        <StatCard
          title="طلبات مستلمة"
          value={stats.received}
          icon={<List className="w-8 h-8 text-orange-600" />}
        />

        <StatCard
          title="تبرعات هذا الشهر"
          value={stats.monthly}
          icon={<TrendingUp className="w-8 h-8 text-purple-600" />}
        />
      </div>

      {/* نظرة عامة */}
      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 mb-10">
        <h2 className="text-2xl font-semibold text-emerald-700 mb-4">نظرة عامة</h2>
        <p className="text-gray-600 leading-relaxed">
          هذا الشهر شهد نشاطاً جيداً من حيث التبرعات والتفاعل مع منشورات الملاجئ.
          يمكنك متابعة أداء مطعمك من خلال الإحصائيات والتقارير المتوفرة.
        </p>
      </div>

      {/* الإجراءات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <ActionCard
          title="إضافة تبرع"
          description="أضف وجبات جديدة للتبرع."
          icon={<PlusCircle className="w-10 h-10 text-emerald-600" />}
          link="/restaurant/donations/add"
          button="إضافة تبرع"
        />

        <ActionCard
          title="منشورات الملاجئ"
          description="شاهد طلبات الملاجئ واحتياجاتهم."
          icon={<FileText className="w-10 h-10 text-emerald-600" />}
          link="/restaurant/posts"
          button="عرض المنشورات"
        />

        <ActionCard
          title="الإحصائيات"
          description="تابع أداء مطعمك."
          icon={<BarChart3 className="w-10 h-10 text-emerald-600" />}
          link="/restaurant/stats"
          button="عرض الإحصائيات"
        />
      </div>
    </RestaurantLayout>
  );
}

// ------------------ Component: Stat Card ------------------
function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        {icon}
      </div>
      <p className="text-3xl font-bold text-emerald-700">{value}</p>
    </div>
  );
}

// ------------------ Component: Action Card ------------------
function ActionCard({ title, description, icon, link, button }: any) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border border-emerald-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="mb-4">{icon}</div>

      <h2 className="text-xl font-semibold text-emerald-700 mb-3">{title}</h2>

      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

      <Link
        to={link}
        className="inline-block w-full text-center bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
      >
        {button}
      </Link>
    </div>
  );
}
