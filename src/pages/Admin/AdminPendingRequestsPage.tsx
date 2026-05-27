import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { getPendingStoreRequests } from "@/api/Admin/getPendingStoreRequests";

export default function AdminPendingRequestsPage() {
  const [requests, setRequests] = useState([]);

  const loadData = async () => {
    try {
      const data = await getPendingStoreRequests();

      // ⭐ نستخدم الرابط كما هو راجع من الـ API
      const mapped = data.map((req: any) => ({
        ...req,
        proofImageUrl: req.proofImageUrl, // عدّلي الاسم إذا مختلف
      }));

      setRequests(mapped);
    } catch (err) {
      console.error("Error loading pending requests:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6" dir="rtl">
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

            {/* ⭐ صور الإثبات */}
            {req.proofImageUrl && (
              <div className="mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative group cursor-pointer w-28">
                      <img
                        src={`http://localhost:7060${req.proofImageUrl}`}
                        className="w-28 h-28 object-cover rounded-lg border"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </DialogTrigger>

                  <DialogContent className="max-w-3xl">
                    <h2 className="sr-only">صورة إثبات</h2>
                    <p className="sr-only">تكبير صورة المستند</p>

                    <img
                      src={`http://localhost:7060${req.proofImageUrl}`}
                      className="w-full h-auto rounded-lg"
                    />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
