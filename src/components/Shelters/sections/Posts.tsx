import { useEffect, useState } from "react";
import { getMyShelterPosts } from "@/api/Shelter/getMyPosts";

export default function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getMyShelterPosts().then(setPosts);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">منشوراتي</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">لا يوجد منشورات بعد.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={post.displayImageUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-3">
                <h3 className="font-semibold text-gray-800">{post.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {post.description}
                </p>

                <p className="text-emerald-600 font-semibold mt-2">
                  الوجبات المطلوبة: {post.requiredMeals}
                </p>

                <p className="text-gray-600 text-sm">
                  المجمّعة: {post.collectedMeals}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
