import { useEffect, useState } from "react";

export default function Winners() {
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    fetch("/api/Challenge/get-winners")
      .then((res) => res.json())
      .then((data) => setWinners(data));
  }, []);

  return (
    <div className="min-h-screen bg-emerald-700 flex items-center justify-center p-10">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-2xl">
        <h1 className="text-3xl font-black text-emerald-700 mb-6 text-center">
          الفائزون في تحدي 10 أيام
        </h1>

        <ul className="space-y-4">
          {winners.map((w: any, i) => (
            <li key={i} className="bg-emerald-50 p-4 rounded-xl">
              {w.fullName} — {w.points} نقطة
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
