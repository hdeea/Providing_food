import { useEffect, useState } from "react";

// استدعاء دوال API من الملفات الصحيحة
import { getMyStoreRequests} from "../../api/Store/getMyStoreRequests"; 

export function Dashboard() {
  const [myRequestsCount, setMyRequestsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const myReq = await getMyStoreRequests();

        setMyRequestsCount(myReq?.length ?? 0);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div>
      <div className="mb-8" dir="rtl">
        <h2 className="text-2xl text-gray-900 mb-2">لوحة التحكم الرئيسية</h2>
        <p className="text-gray-600">مرحباً بك في نظام إدارة التبرعات الغذائية</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {/* إجمالي طلباتي */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600 mb-1">إجمالي طلباتي</p>
          <p className="text-3xl text-gray-900">
            {loading ? "…" : myRequestsCount}
          </p>
        </div>

        {/* القسائم الصادرة */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600 mb-1">القسائم الصادرة</p>
          <p className="text-3xl text-gray-900">—</p>
        </div>

        {/* القسائم المستلمة */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600 mb-1">القسائم المستلمة</p>
          <p className="text-3xl text-gray-900">—</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg text-gray-900 mb-4" dir="rtl">النشاطات الأخيرة</h3>
        <p className="text-gray-500 text-sm">لا توجد نشاطات بعد</p>
      </div>
    </div>
  );
}
