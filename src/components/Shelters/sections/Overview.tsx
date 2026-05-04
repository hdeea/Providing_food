export default function Overview({ shelter }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">نظرة عامة</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-orange-700">حالة الملجأ</h3>
          <p className="text-3xl font-bold mt-2 text-orange-900">
            {shelter ? shelter.status : "لم يتم تقديم طلب بعد"}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-blue-700">عدد التبرعات</h3>
          <p className="text-3xl font-bold mt-2 text-blue-900">0</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-emerald-700">عدد المنشورات</h3>
          <p className="text-3xl font-bold mt-2 text-emerald-900">0</p>
        </div>

      </div>
    </div>
  );
}
