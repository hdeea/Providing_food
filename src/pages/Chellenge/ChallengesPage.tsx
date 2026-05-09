import { useEffect, useState } from "react";
import { getAllChallenges } from "@/api/Admin/challenge/getAllChallenges";
import { useNavigate } from "react-router-dom";

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const data = await getAllChallenges();
      setChallenges(data || []);
    };
    load();
  }, []);

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-3xl font-bold text-slate-900 text-center">
        🌙 تحديات رمضان
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((c: any) => (
          <div
            key={c.id}
            className="
              bg-white/70 backdrop-blur-xl 
              border border-white/40 
              rounded-2xl p-6 shadow
            "
          >
            <h2 className="text-xl font-bold text-slate-800">{c.name}</h2>

            <p className="text-slate-700 mt-2">
              <strong>عدد الأيام:</strong>{" "}
              {Math.ceil(
                (new Date(c.endDate).getTime() - new Date(c.startDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}
            </p>

            <button
              onClick={() => navigate(`/challenges/${c.id}`)}
              className="
                mt-4 w-full py-2 bg-emerald-600 text-white rounded-xl 
                hover:bg-emerald-700 transition
              "
            >
              عرض التفاصيل
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
