import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, PlusCircle, Heart, ClipboardList } from "lucide-react";

export default function ShelterSidebar({ shelter }) {
  const status = shelter?.status;
  const { pathname } = useLocation();

  const linkClass = (path: string) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
      pathname.includes(path)
        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-52 bg-white shadow-sm p-4 border-r border-gray-200 min-h-screen">
      <h2 className="text-lg font-bold mb-5 text-emerald-700">لوحة الملجأ</h2>

      <nav className="flex flex-col gap-1">

        <Link to="/shelter/dashboard" className={linkClass("dashboard")}>
          <LayoutDashboard className="w-4 h-4" />
          نظرة عامة
        </Link>

        <Link to="/shelter/dashboard/request-status" className={linkClass("request-status")}>
          <ClipboardList className="w-4 h-4" />
          حالة الطلب
        </Link>

        {!shelter && (
          <Link to="/shelter/dashboard/register" className={linkClass("register")}>
            <FileText className="w-4 h-4" />
            تقديم طلب اعتماد
          </Link>
        )}

        {status === "Approved" && (
          <>
            <Link to="/shelter/dashboard/posts" className={linkClass("posts")}>
              <FileText className="w-4 h-4" />
              منشوراتي
            </Link>

            <Link to="/shelter/dashboard/create-post" className={linkClass("create-post")}>
              <PlusCircle className="w-4 h-4" />
              إنشاء منشور
            </Link>

            <Link to="/shelter/dashboard/donations" className={linkClass("donations")}>
              <Heart className="w-4 h-4" />
              التبرعات
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
