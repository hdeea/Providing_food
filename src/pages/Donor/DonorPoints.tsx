import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function DonorPoints() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    fetch(`/api/challenge/my-points`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((d) => setData(d));
  }, [user]);

  if (!data) return <p>تحميل...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-700">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-black text-emerald-700 mb-4">
          نقاطك الحالية
        </h1>

        <p className="text-5xl font-black text-emerald-900">{data.points}</p>

        <p className="mt-4 text-lg text-gray-700">
          التحدي: {data.challengeName || "لا يوجد تحدي"}
        </p>

        <p className="text-gray-500">
          الحالة: {data.challengeStatus}
        </p>
      </div>
    </div>
  );
}
