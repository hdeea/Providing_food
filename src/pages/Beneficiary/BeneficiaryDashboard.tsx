import { Link } from "react-router-dom";

export default function BeneficiaryDashboard() {
  const userName = "مستفيد"; // لاحقاً منجيب الاسم من الـ API أو الـ Auth

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-green-200">

        <h2 className="text-3xl font-bold text-center text-green-700 mb-4">
          مرحباً، {userName}
        </h2>

        <p className="text-center text-gray-600 mb-8">
          يمكنك إدارة طلباتك من هنا
        </p>

        <div className="grid md:grid-cols-2 gap-6">

          {/* تقديم طلب */}
          <Link
            to="/beneficiary/submit"
            className="block bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-xl text-lg font-semibold shadow-md transition"
          >
            تقديم طلب مساعدة
          </Link>

          {/* تتبع الطلب */}
          <Link
            to="/beneficiary/track"
            className="block bg-white border border-green-400 text-green-700 hover:bg-green-50 text-center py-4 rounded-xl text-lg font-semibold shadow-md transition"
          >
حالة طلبــي
          </Link>

        </div>

        {/* معلومات بسيطة */}
        <div className="mt-10 bg-green-50 border border-green-200 p-5 rounded-xl">
          <h3 className="text-green-700 font-semibold mb-2">معلومات الحساب</h3>

          <p className="text-gray-700">
            <span className="font-semibold">الاسم:</span> {userName}
          </p>

          <p className="text-gray-700 mt-1">
            <span className="font-semibold">نوع الحساب:</span> مستفيد
          </p>

          <p className="text-gray-700 mt-1">
            <span className="font-semibold">آخر تسجيل دخول:</span> الآن
          </p>
        </div>

      </div>
    </div>
  );
}
