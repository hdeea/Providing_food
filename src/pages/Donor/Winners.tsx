import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "react-router-dom";

export default function Winners() {
  const { id } = useParams();
  const { user } = useAuth();

  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch(`/api/challenge/${id}/leaderboard`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // الفائزين = اللي نقاطهم 10
        const filtered = data.filter((x: any) => x.points >= 10);
        setWinners(filtered);
      })
      .finally(() => setLoading(false));
  }, [id, user]);

  if (loading) return <p className="p-6">جاري التحميل...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-700">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-black text-emerald-700 mb-6 text-center">
          الفائزون في التحدي
        </h1>

        {winners.length === 0 && (
          <p className="text-center text-gray-600">لا يوجد فائزون بعد</p>
        )}

        {winners.map((u, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-gray-100 p-4 rounded-xl mb-3"
          >
            <span className="font-bold text-lg">
              {u.fullName}
            </span>
            <span className="text-emerald-700 font-black">{u.points} نقطة</span>
          </div>
        ))}
      </div>
    </div>
  );
}
