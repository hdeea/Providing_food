import { Link } from "react-router-dom";

export default function ShelterSidebar({ shelter }) {
  const status = shelter?.status;

  return (
    <aside className="w-64 bg-white shadow-lg p-6 border-r">
      <h2 className="text-2xl font-bold mb-8 text-emerald-700">الملجأ</h2>

      <nav className="flex flex-col gap-2">

        {/* يظهر دائماً */}
        <Link to="/shelter/dashboard" className="link">
          نظرة عامة
        </Link>

        {/* يظهر دائماً */}
        <Link to="/shelter/dashboard/request-status" className="link">
          حالة الطلب
        </Link>

        {/* يظهر فقط إذا لا يوجد ملجأ */}
        {!shelter && (
          <Link to="/shelter/dashboard/register" className="link">
            تقديم طلب اعتماد
          </Link>
        )}

        {/* يظهر فقط إذا Approved */}
        {status === "Approved" && (
          <>
            <Link to="/shelter/dashboard/posts" className="link">
              منشوراتي
            </Link>

            <Link to="/shelter/dashboard/create-post" className="link">
              إنشاء منشور
            </Link>

            <Link to="/shelter/dashboard/donations" className="link">
              التبرعات
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
