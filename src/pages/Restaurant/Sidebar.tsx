import {
  Home,
  PlusCircle,
  List,
  FileText,
  Settings,
  LogOut,
  QrCode,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Menu
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Sidebar({ user }: { user: any }) {
  const location = useLocation();

  // Mini sidebar toggle
  const [collapsed, setCollapsed] = useState(false);

  // Collapse sections
  const [openMain, setOpenMain] = useState(true);
  const [openDonations, setOpenDonations] = useState(true);
  const [openShelters, setOpenShelters] = useState(true);
  const [openAccount, setOpenAccount] = useState(true);

  return (
    <aside
      className={`
        bg-white shadow-lg border-l border-emerald-100 p-4 transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {!collapsed && (
          <h1 className="text-xl font-bold text-emerald-700">
            🍽️ {user?.fullName}
          </h1>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-emerald-50 rounded-lg transition"
        >
          <Menu size={22} className="text-emerald-700" />
        </button>
      </div>

      {/* MAIN SECTION */}
      <SidebarSection
        title="الرئيسية"
        open={openMain}
        collapsed={collapsed}
        toggle={() => setOpenMain(!openMain)}
      >
        <SidebarItem
          to="/restaurant/dashboard"
          icon={<Home size={20} />}
          label="لوحة التحكم"
          active={location.pathname === "/restaurant/dashboard"}
          collapsed={collapsed}
        />

      </SidebarSection>

      {/* DONATIONS SECTION */}
      <SidebarSection
        title="التبرعات"
        open={openDonations}
        collapsed={collapsed}
        toggle={() => setOpenDonations(!openDonations)}
      >
        <SidebarItem
          to="/restaurant/donations/add"
          icon={<PlusCircle size={20} />}
          label="إضافة تبرع"
          active={location.pathname === "/restaurant/donations/add"}
          collapsed={collapsed}
        />

        <SidebarItem
          to="/restaurant/donations"
          icon={<List size={20} />}
          label="تبرعاتي"
          active={location.pathname === "/restaurant/donations"}
          collapsed={collapsed}
        />
      </SidebarSection>

      {/* SHELTERS SECTION */}
      <SidebarSection
        title="الملاجئ"
        open={openShelters}
        collapsed={collapsed}
        toggle={() => setOpenShelters(!openShelters)}
      >
        <SidebarItem
          to="/restaurant/posts"
          icon={<FileText size={20} />}
          label="منشورات الملاجئ"
          active={location.pathname === "/restaurant/posts"}
          collapsed={collapsed}
        />

        <SidebarItem
          to="/restaurant/scan-bond"
          icon={<QrCode size={20} />}
          label="مسح QR"
          active={location.pathname === "/restaurant/scan-bond"}
          collapsed={collapsed}
        />
      </SidebarSection>

      {/* ACCOUNT SECTION */}
      <SidebarSection
        title="الحساب"
        open={openAccount}
        collapsed={collapsed}
        toggle={() => setOpenAccount(!openAccount)}
      >
        <SidebarItem
          to="/restaurant/settings"
          icon={<Settings size={20} />}
          label="الإعدادات"
          active={location.pathname === "/restaurant/settings"}
          collapsed={collapsed}
        />

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/restaurant/login";
          }}
          className={`
            flex items-center gap-3 font-semibold mt-3 px-3 py-2 rounded-lg transition
            ${collapsed ? "justify-center" : "text-red-600 hover:text-red-800"}
          `}
        >
          <LogOut size={20} />
          {!collapsed && "تسجيل الخروج"}
        </button>
      </SidebarSection>
    </aside>
  );
}

/* ---------------- Components ---------------- */

function SidebarSection({ title, children, open, toggle, collapsed }: any) {
  return (
    <div className="mb-4">
      {/* Section Header */}
      <div
        onClick={toggle}
        className={`
          flex items-center justify-between cursor-pointer mb-2
          ${collapsed ? "justify-center" : ""}
        `}
      >
        {!collapsed && (
          <p className="text-xs text-emerald-600 font-semibold">{title}</p>
        )}

        {!collapsed && (
          open ? (
            <ChevronDown size={18} className="text-emerald-600" />
          ) : (
            <ChevronRight size={18} className="text-emerald-600" />
          )
        )}
      </div>

      {/* Items */}
      <div
        className={`
          overflow-hidden transition-all duration-300
          ${open ? "max-h-40" : "max-h-0"}
        `}
      >
        <div className="space-y-2">{children}</div>
      </div>
    </div>
  );
}

function SidebarItem({ to, icon, label, active, collapsed }: any) {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 font-medium px-3 py-2 rounded-lg transition-all relative
        ${active
          ? "bg-emerald-600 text-white shadow-md"
          : "text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900"}
        ${collapsed ? "justify-center" : ""}
      `}
    >
      {/* Indicator Bar */}
      {active && !collapsed && (
        <span className="absolute right-0 top-0 h-full w-1 bg-white rounded-l-lg"></span>
      )}

      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
