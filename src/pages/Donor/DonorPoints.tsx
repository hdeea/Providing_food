import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function DonorPoints() {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);

  useEffect(() => {
    fetch(`/api/Challenge/get-donor-points/${user?.id}`)
      .then((res) => res.json())
      .then((data) => setPoints(data.points || 0));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-700">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-black text-emerald-700 mb-4">
          نقاطك الحالية
        </h1>

        <p className="text-5xl font-black text-emerald-900">{points}</p>
      </div>
    </div>
  );
}
