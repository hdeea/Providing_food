import { Heart } from "lucide-react";

export default function Donations({ donations }) {
  const hasDonations = donations && donations.length > 0;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <h1 className="text-xl font-bold text-emerald-700 mb-5 text-center">
        التبرعات
      </h1>

      {!hasDonations && (
        <div className="flex flex-col items-center gap-3 py-6 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-700">
          <Heart className="w-10 h-10" />
          <p className="text-lg font-semibold">لا يوجد تبرعات حالياً</p>
        </div>
      )}

      {hasDonations && (
        <div className="space-y-4">
          {donations.map((donation, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border bg-white shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-800">{donation.restaurantName}</p>
                <p className="text-sm text-gray-500">
                  عدد الوجبات: {donation.meals}
                </p>
              </div>
              <Heart className="w-6 h-6 text-emerald-600" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
