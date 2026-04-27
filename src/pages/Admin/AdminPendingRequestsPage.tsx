import { useEffect, useState } from "react";
import {getPendingStoreRequests} from "@/api/Admin/getPendingStoreRequests"; 
// إذا عندك API آخر للـ Beneficiary بدليه هون

export default function AdminPendingRequestsPage() {
  const [requests, setRequests] = useState([]);

  const loadData = async () => {
    try {
      const data = await getPendingStoreRequests(); 
      setRequests(data);
    } catch (err) {
      console.error("Error loading pending requests:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        الطلبات المعلّقة
      </h1>

      <div className="space-y-4">
        {requests.map((req: any) => (
          <div
            key={req.id}
            className="bg-white p-4 rounded-xl shadow border border-green-200"
          >
            <p><b>الاسم:</b> {req.fullName}</p>
            <p><b>الهاتف:</b> {req.phoneNumber}</p>
            <p><b>عدد العائلة:</b> {req.familySize}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
