import { useEffect, useState } from "react";
import { getMyShelterPosts } from "@/api/Shelter/getMyPosts";

export default function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getMyShelterPosts().then(setPosts);
  }, []);

  const fixImage = (url: string) => {
    if (!url) return "https://via.placeholder.com/400x300?text=No+Image";
    if (url.startsWith("http")) return url;
    return `https://localhost:7060${url}`;
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-emerald-700">
        منشوراتي
      </h1>

      {posts.length === 0 ? (
        <p className="text-gray-500 text-lg">لا يوجد منشورات بعد.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition border border-emerald-100 overflow-hidden"
            >
              <img
                src={fixImage(post.displayImageUrl)}
                alt={post.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-5">
                <h3 className="text-xl font-bold text-emerald-700">
                  {post.title}
                </h3>

                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {post.description}
                </p>

                <div className="mt-4">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>المطلوب: {post.requiredMeals}</span>
                    <span>المجمّع: {post.collectedMeals}</span>
                  </div>

                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          (post.collectedMeals / post.requiredMeals) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <button className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-semibold">
                  عرض التفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
