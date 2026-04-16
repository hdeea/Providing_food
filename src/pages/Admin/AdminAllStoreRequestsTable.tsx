// AdminAllStoreRequestsTable.tsx
import { useEffect, useState } from "react";
import { StoreRequests } from "@/types";
import { getAllStoreRequests } from "@/api/Admin/getAllStoreRequests";

export default function AdminAllStoreRequestsTable() {
  const [requests, setRequests] = useState<StoreRequests[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllStoreRequests();
        setRequests(data);
      } catch (error) {
        console.error("Failed to load all store requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="p-4">جاري تحميل الطلبات...</p>;
  if (requests.length === 0) return <p className="p-4">لا توجد طلبات</p>;

  return (
    <div className="p-4" dir="rtl">
      <h2 className="text-xl font-bold mb-4">كل طلبات المتاجر</h2>

      <table className="w-full border-collapse border border-gray-300 text-right">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">اسم المتجر</th>
            <th className="border p-2">الموقع</th>
            <th className="border p-2">الهاتف</th>
            <th className="border p-2">عدد السلال</th>
            <th className="border p-2">محتوى السلة</th>
            <th className="border p-2">الحالة</th>
            <th className="border p-2">تاريخ الإنشاء</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((req) => (
            <tr key={req.requestId}>
              <td className="border p-2">{req.requestId}</td>
              <td className="border p-2">{req.storeName}</td>
              <td className="border p-2">{req.storeLocation}</td>
              <td className="border p-2">{req.phoneNumber}</td>
              <td className="border p-2">{req.basketCount}</td>
              <td className="border p-2">{req.basketContents}</td>
              <td className="border p-2">{req.status}</td>
              <td className="border p-2">{req.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
