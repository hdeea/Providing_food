import Overview from "./sections/Overview";
import Posts from "./sections/Posts";
import CreatePost from "./sections/CreatePost";
import Donations from "./sections/Donations";
import RequestStatus from "./sections/RequestStatus";
import ShelterRegister from "./ShelterRegister";
import { useLocation } from "react-router-dom";

export default function ShelterContent({ shelter }) {
  const location = useLocation();
  const currentPage = location.pathname.split("/").pop();

  // 1) لا يوجد طلب اعتماد
  if (!shelter) {
    if (currentPage === "register") {
      return (
        <ShelterRegister
          onSuccess={() =>
            (window.location.href = "/shelter/dashboard/request-status")
          }
        />
      );
    }

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

  // 2) الطلب قيد المراجعة
  if (shelter.status === "Pending") {
    return <RequestStatus shelter={shelter} />;
  }

  // 3) الطلب مرفوض
  if (shelter.status === "Rejected") {
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

  // 4) Approved → عرض الصفحات كاملة
  switch (currentPage) {
  case "overview":
    return <Overview shelter={shelter} />;

  case "posts":
    return <Posts/>;

  case "create-post":
    return <CreatePost shelter={shelter} />;

  case "donations":
    return <Donations shelter={shelter} />;

  case "request-status":
    return <RequestStatus shelter={shelter} />;

  default:
    return <Overview shelter={shelter} />;
}

}
