import { useState } from "react";
import { Bell, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ShelterHeader() {
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm border-b border-emerald-100 px-6 py-3 flex justify-between items-center">
      
      <h1 className="text-2xl font-bold text-emerald-700">Providing Food</h1>

      <div className="flex items-center gap-4">

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-emerald-50 transition">
          <Bell className="w-6 h-6 text-emerald-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-emerald-50 transition"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="font-semibold text-emerald-700">{user?.fullName}</span>
          </button>

          {open && (
            <div className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden">
              <button className="w-full text-right px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
                <User className="w-4 h-4" />
                حسابي
              </button>

              <button
                onClick={logout}
                className="w-full text-right px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                تسجيل خروج
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
