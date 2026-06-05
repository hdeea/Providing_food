import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  Store,
  User,
  Home,
  Gift,
  Ticket,
} from "lucide-react";
import { CalendarRange } from "lucide-react";

const Sidebar = ({ open }) => {
  const location = useLocation();

const adminLinks = [
  { name: "لوحة التحكم", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "تبرعات المطاعم", path: "/admin/restaurants/donations", icon: <Gift size={20} /> },
  { name: "المتاجر", path: "/admin/stores", icon: <Store size={20} /> },
  { name: "المستفيدون", path: "/admin/beneficiaries", icon: <User size={20} /> },
  { name: "الملاجئ", path: "/admin/shelters", icon: <Home size={20} /> },
  {name: "سندات الطعام", path: "/admin/food-bonds", icon: <Gift size={20} /> },

  { name: "سعر السند", path: "/admin/gift-bond/price", icon: <Gift size={20} /> },
  { name: " تبرعات السندات", path: "/admin/gift-bond/donations", icon: <Gift size={20} /> },

  { name: "التبرعات المالية", path: "/admin/money-donations", icon: <Gift size={20} /> },
  { name: "إصدار قسائم غذائية", path: "/admin/vouchers", icon: <Ticket size={20} /> },
  { name: "المواسم", path: "/admin/seasons", icon: <CalendarRange size={20} /> }
];


  return (
    <aside
      className={`h-[calc(100vh-64px)] bg-white border-l border-gray-200 fixed right-0 top-16 z-30 transition-all duration-300 dark:bg-slate-900 dark:border-slate-700
      ${open ? "w-64" : "w-20"}`}
    >
      <nav className="p-4 space-y-1">
        {adminLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center justify-end gap-3 px-4 py-2 rounded-lg transition 
              ${
                location.pathname === link.path
                  ? "bg-emerald-100 text-emerald-700 font-semibold dark:bg-emerald-900 dark:text-emerald-300"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
          >
            {open && <span>{link.name}</span>}
            {link.icon}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
