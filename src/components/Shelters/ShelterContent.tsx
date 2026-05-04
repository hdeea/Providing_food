import Overview from "./sections/Overview";
import Posts from "./sections/Posts";
import CreatePost from "./sections/CreatePost";
import Donations from "./sections/Donations";
import RequestStatus from "./sections/RequestStatus";
import ShelterRegister from "./ShelterRegister";
import { useLocation } from "react-router-dom";
export default function ShelterContent({ shelter }) {
  const status = shelter?.status;

  if (!shelter) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          لم يتم تقديم طلب اعتماد بعد
        </h2>
        <a
          href="/shelter/dashboard/register"
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg"
        >
          تقديم طلب اعتماد
        </a>
      </div>
    );
  }

  if (status === "Pending") {
    return <RequestStatus shelter={shelter} />;
  }

  if (status === "Rejected") {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          تم رفض طلبك ❌
        </h2>
        <p className="text-gray-600 mb-4">
          لا يمكنك الوصول إلى لوحة التحكم قبل الموافقة.
        </p>
      </div>
    );
  }

  return null; // Approved → الصفحات تُعرض من الـ Routes
}
