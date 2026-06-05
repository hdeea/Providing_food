import { Home, ShoppingBasket, Ticket, Settings, ScanLine } from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: "home", label: "الرئيسية", icon: Home },
    { id: "vouchers", label: "القسائم", icon: Ticket },
    { id: "settings", label: "إنشاء طلب", icon: Settings },
    { id: "baskets", label: "طلباتي", icon: ShoppingBasket },

    // ⭐ زر مسح القسائم الجديد
    { id: "scan-voucher", label: "مسح قسيمة", icon: ScanLine, external: true },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-green-50 to-emerald-50 border-l border-green-100 min-h-screen p-6">
      <div className="mb-8" dir="rtl">
        <h1 className="text-xl text-green-800 mb-1 font-bold">نظام التبرعات الغذائية</h1>
        <p className="text-sm text-green-600">إدارة المتجر</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.external) {
                  window.location.href = "/store/scan-voucher";
                  return;
                }

                onSectionChange(item.id);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-right transition-all ${
                activeSection === item.id
                  ? "bg-green-600 text-white shadow"
                  : "text-green-700 hover:bg-green-100"
              }`}
              dir="rtl"
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
