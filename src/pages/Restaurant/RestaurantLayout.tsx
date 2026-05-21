import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";

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

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [status, setStatus] = useState<"none" | "pending" | "approved" | null>(null);

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
      <div className="flex items-center justify-center min-h-screen bg-emerald-50">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center border border-emerald-200">
          <h1 className="text-2xl font-bold text-emerald-700 mb-4">لم يتم تقديم طلب انضمام</h1>
          <p className="text-gray-700 mb-6">يجب تقديم طلب انضمام قبل استخدام النظام.</p>

          <a
            href="/restaurant/join-request"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
          >
            تقديم طلب انضمام
          </a>
        </div>
      </div>
    );
  }

  // ------------------ حالة: Pending ------------------
  if (status === "pending") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-50">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center border border-emerald-200">
          <h1 className="text-2xl font-bold text-emerald-700 mb-4">طلبك قيد الانتظار</h1>
          <p className="text-gray-700">
            تم إرسال طلب الانضمام. الرجاء انتظار موافقة الإدارة.
          </p>
        </div>
      </div>
    );
  }

  // ------------------ حالة: Approved → عرض النظام الكامل ------------------
  return (
    <div className="flex min-h-screen bg-emerald-50">
      <Sidebar user={user} />
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
