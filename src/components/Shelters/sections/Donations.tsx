export default function Donations({ shelter }: { shelter: any }) {

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">التبرعات</h1>

      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <p className="text-gray-600">لا يوجد تبرعات حالياً.</p>
      </div>
    </div>
  );
}
