import { useEffect, useState } from "react";
import { getPendingStoreRequests } from "@/api/Admin/getPendingStoreRequests";
import { StoreRequests } from "@/types";
import { approveStoreRequest } from "@/api/Admin/approveStoreRequest";
import { rejectStoreRequest } from "@/api/Admin/rejectStoreRequest";

export default function AdminStoreRequestsTable() {
  const [requests, setRequests] = useState<StoreRequests[]>([]);
  const [loading, setLoading] = useState(true);
const handleApprove = async (id: number) => {
  try {
    await approveStoreRequest(id);

    // تحديث الجدول مباشرة بدون Refresh
    setRequests((prev) => prev.filter((r) => r.requestId !== id));

    alert("تمت الموافقة على الطلب");
  } catch (error) {
    alert("فشل في الموافقة على الطلب");
  }
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPendingStoreRequests();
        setRequests(data);
      } catch (error) {
        console.error("Failed to load pending store requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="p-4">جاري تحميل الطلبات...</p>;
  if (requests.length === 0) return <p className="p-4">لا توجد طلبات معلّقة</p>;

  return (
    <div className="p-4" dir="rtl">
      <h2 className="text-xl font-bold mb-4">طلبات المتاجر المعلّقة</h2>

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
            <th className="border p-2">إجراء</th>
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
              <td className="border p-2">
              <td className="border p-2">
  <button
    onClick={() => handleApprove(req.requestId)}
    className="bg-green-600 text-white px-3 py-1 rounded"
  >
    موافقة
  </button>
  <button
    onClick={() => rejectStoreRequest(req.requestId)}
    className="bg-red-600 text-white px-3 py-1 rounded ml-2"
  >
    رفض
  </button>

</td>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
