import { useEffect, useState } from "react";

export default function BeneficiaryNavbar() {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notification", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to load notifications");
        return;
      }

      const data = await res.json();
      setNotifications(data);
      setUnread(data.filter((n: any) => !n.isRead).length);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="w-full bg-white shadow-sm border-b border-green-100 mb-6">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-end">
        <div className="relative">
          {/* أيقونة الجرس */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-green-50 hover:bg-green-100 transition"
          >
            <span className="text-xl">🔔</span>

            {unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 rounded-full">
                {unread}
              </span>
            )}
          </button>

          {/* قائمة الإشعارات */}
          {open && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-green-100 z-50">
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <span className="font-semibold text-green-700">
                  الإشعارات
                </span>
                <button
                  onClick={fetchNotifications}
                  className="text-xs text-green-600 hover:underline"
                >
                  تحديث
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center text-gray-500 py-4 text-sm">
                    لا يوجد إشعارات حالياً
                  </p>
                ) : (
                  notifications
                    .slice()
                    .reverse()
                    .map((n: any) => (
                      <div
                        key={n.id}
                        className="px-3 py-2 border-b last:border-b-0 hover:bg-green-50"
                      >
                        <p className="text-sm font-semibold text-gray-800">
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-600">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString("ar-EG")}
                        </p>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
