import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import BeneficiaryNavbar from "@/components/BeneficiaryNavbar";

export default function BeneficiaryDashboard() {
  const { user } = useAuth();
  const userName = user?.fullName || "مستفيد";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-6 px-4">

      {/* 🔔 شريط الإشعارات */}
      <BeneficiaryNavbar />

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-green-200">

        <h2 className="text-3xl font-bold text-center text-green-700 mb-4">
          مرحباً، {userName}
        </h2>

        <p className="text-center text-gray-600 mb-8">
          يمكنك إدارة كل خدماتك من هنا
        </p>

        <div className="grid md:grid-cols-2 gap-6">

          <Link
            to="/beneficiary/submit"
            className="block bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-xl text-lg font-semibold shadow-md transition"
          >
            تقديم طلب مساعدة
          </Link>

          <Link
            to="/beneficiary/track"
            className="block bg-white border border-green-400 text-green-700 hover:bg-green-50 text-center py-4 rounded-xl text-lg font-semibold shadow-md transition"
          >
            حالة طلبــي
          </Link>

          <Link
            to="/beneficiary/bonds"
            className="block bg-green-500 hover:bg-green-600 text-white text-center py-4 rounded-xl text-lg font-semibold shadow-md transition"
          >
            سنداتــي
          </Link>

          <Link
            to="/beneficiary/vouchers"
            className="block bg-white border border-green-400 text-green-700 hover:bg-green-50 text-center py-4 rounded-xl text-lg font-semibold shadow-md transition"
          >
            قسائمــي
          </Link>

        </div>

      </div>
    </div>
  );
}
