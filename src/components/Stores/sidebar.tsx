import { Home, ShoppingBasket, Ticket, Settings } from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: "home", label: "الرئيسية", icon: Home },
    { id: "vouchers", label: "القسائم", icon: Ticket },
    { id: "settings", label: "انشاء طلب ", icon: Settings },
    { id: "baskets", label: "طلباتي", icon: ShoppingBasket },
    { id: "scan", label: "مسح QR", icon: Ticket }
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-green-50 to-beige-50 border-l border-green-100 min-h-screen p-6">
      <div className="mb-8" dir="rtl">
        <h1 className="text-xl text-green-800 mb-1">نظام التبرعات الغذائية</h1>
        <p className="text-sm text-green-600">إدارة المتجر</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                // زر مسح QR يفتح صفحة مستقلة
                if (item.id === "scan") {
                  window.location.href = "/store/scan";
                  return;
                }

                // باقي الأزرار تشتغل داخل نفس الصفحة
                onSectionChange(item.id);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-right transition-colors ${
                activeSection === item.id
                  ? "bg-green-600 text-white"
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
