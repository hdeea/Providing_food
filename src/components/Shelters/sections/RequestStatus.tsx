export default function RequestStatus({ shelter }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">حالة طلب الاعتماد</h1>

      {!shelter && (
        <p className="text-gray-600">لم يتم تقديم طلب بعد.</p>
      )}

      {shelter && (
        <div className="bg-white shadow p-6 rounded-xl border">
          <p className="text-lg">حالتك الحالية:</p>

          <p className="text-3xl font-bold mt-2 text-emerald-700">
            {shelter.status}
          </p>

          {shelter.status === "Pending" && (
            <p className="text-gray-500 mt-4">
              طلبك قيد المراجعة من قبل المسؤول.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
