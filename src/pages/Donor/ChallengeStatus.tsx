import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function ChallengeStatus() {
  const { user } = useAuth();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch(`/api/challenge/status`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p className="p-6">جاري التحميل...</p>;

  if (!status)
    return (
      <div className="p-6 text-center text-red-600 font-bold">
        لا يوجد تحدي حالياً
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-700">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md text-center">

        <h1 className="text-3xl font-black text-emerald-700 mb-4">
          حالة التحدي
        </h1>

        <p className="text-xl font-bold text-emerald-900 mb-2">
          {status.challengeName}
        </p>

        <p className="text-gray-700 mb-2">
          الحالة: {status.challengeStatus}
        </p>

        <p className="text-gray-700 mb-2">
          الأيام المتبقية: {status.remainingDays}
        </p>

        <p className="text-gray-700 mb-2">
          نقاطك: {status.myPoints}
        </p>

        <p className="text-gray-700">
          النقاط المطلوبة للفوز: {status.requiredPoints}
        </p>

      </div>
    </div>
  );
}
