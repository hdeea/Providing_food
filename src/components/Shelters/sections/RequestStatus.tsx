import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function RequestStatus({ shelter }) {
  const status = shelter?.status || "Pending";

  const config = {
    Approved: {
      icon: <CheckCircle className="w-10 h-10 text-emerald-600" />,
      text: "تمت الموافقة",
      color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    },
    Rejected: {
      icon: <XCircle className="w-10 h-10 text-red-600" />,
      text: "مرفوض",
      color: "bg-red-50 border-red-200 text-red-700",
    },
    Pending: {
      icon: <Clock className="w-10 h-10 text-yellow-600" />,
      text: "قيد المراجعة",
      color: "bg-yellow-50 border-yellow-200 text-yellow-700",
    },
  };

  const ui = config[status] || config.Pending;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <h1 className="text-xl font-bold text-emerald-700 mb-5 text-center">
        حالة طلب الاعتماد
      </h1>

      <div
        className={`flex flex-col items-center gap-3 py-6 rounded-xl border ${ui.color}`}
      >
        {ui.icon}
        <p className="text-lg font-semibold">{ui.text}</p>
      </div>

      <p className="text-gray-500 text-sm text-center mt-4">
        سيتم إعلامك فور تحديث الحالة.
      </p>
    </div>
  );
}
