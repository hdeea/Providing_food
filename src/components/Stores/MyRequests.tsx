import { useEffect, useState } from "react";
import { getMyStoreRequests } from "@/api/Store/getMyStoreRequests";
import { Clock, CheckCircle, XCircle, Package } from "lucide-react";

export function MyRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyStoreRequests();
        setRequests(data);
      } catch (err) {
        console.error("Error loading requests:", err);
      }
    }
    load();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      case "Approved":
        return "text-green-700 bg-green-100";
      case "Rejected":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div dir="rtl">
      <h2 className="text-2xl text-gray-900 mb-6">طلباتي</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map((req: any) => (
          <div
            key={req.requestId}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {req.storeName}
              </h3>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  req.status
                )}`}
              >
                {req.status === "Pending"
                  ? "قيد المراجعة"
                  : req.status === "Approved"
                  ? "مقبول"
                  : "مرفوض"}
              </span>
            </div>

            {/* Info */}
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>📍 الموقع:</strong> {req.storeLocation}
              </p>
              <p>
                <strong>📞 الهاتف:</strong> {req.phoneNumber}
              </p>
              <p className="flex items-center gap-2">
                <Package className="w-4 h-4 text-green-600" />
                <strong>عدد السلال:</strong> {req.basketCount}
              </p>
              <p>
                <strong>محتوى السلة:</strong> {req.basketContents}
              </p>
            </div>

            {/* Date */}
            <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm">
              <Clock className="w-4 h-4" />
              <span>
                {new Date(req.createdAt).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {requests.length === 0 && (
        <p className="text-gray-500 text-center mt-10">لا توجد طلبات بعد</p>
      )}
    </div>
  );
}
