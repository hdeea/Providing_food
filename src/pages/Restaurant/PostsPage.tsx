import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getShelterPosts } from "../../api/Restaurant/getShelterPosts";
import { donateToShelter } from "../../api/Restaurant/donateToShelter";
import { useToast } from "@/components/ui/use-toast";

export default function PostsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [successMessage, setSuccessMessage] = useState("");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDonateModal, setShowDonateModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [meals, setMeals] = useState("");

  useEffect(() => {
    if (!user?.token) return;

    getShelterPosts(user.token)
      .then((res) => setPosts(res))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [user]);

  const openDonateModal = (postId: number) => {
    const post = posts.find((p: any) => p.id === postId);

    if (post?.status === "Completed") {
      toast({
        title: "اكتمل التبرع",
        description: "لا يمكن التبرع لأن هذا المنشور مكتمل",
        variant: "destructive",
      });
      return;
    }

    setSelectedPostId(postId);
    setShowDonateModal(true);
  };

  const handleDonateSubmit = async () => {
    if (!selectedPostId || !meals) {
      toast({
        title: "تنبيه",
        description: "الرجاء إدخال عدد الوجبات",
        variant: "destructive",
      });
      return;
    }

    const post = posts.find((p: any) => p.id === selectedPostId);

    if (!post) {
      toast({
        title: "خطأ",
        description: "المنشور غير موجود",
        variant: "destructive",
      });
      return;
    }

    if (post.status === "Completed") {
      toast({
        title: "اكتمل التبرع",
        description: "لا يمكن التبرع لأن هذا المنشور مكتمل",
        variant: "destructive",
      });
      return;
    }

    const mealsNumber = Number(meals);
    const remaining = post.requiredMeals - post.collectedMeals;

    if (mealsNumber > remaining) {
      toast({
        title: "عدد غير صالح",
        description: `لا يمكنك التبرع بأكثر من ${remaining} وجبة`,
        variant: "destructive",
      });
      return;
    }

    if (mealsNumber <= 0) {
      toast({
        title: "عدد غير صالح",
        description: "أدخل عدد وجبات صحيح",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await donateToShelter(
        user.token,
        selectedPostId,
        mealsNumber
      );

      setSuccessMessage(res.message || "تم التبرع بنجاح");

      getShelterPosts(user.token).then((updated) => setPosts(updated));

      setTimeout(() => setSuccessMessage(""), 3000);

      setMeals("");
      setShowDonateModal(false);

    } catch (err: any) {
      toast({
        title: "خطأ",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>

      {successMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 
                        bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg 
                        text-lg font-semibold animate-fade">
          {successMessage}
        </div>
      )}

      <h1 className="text-3xl font-bold text-emerald-700 mb-6">
        منشورات الملاجئ 🏠
      </h1>

      {loading && <p>جاري التحميل...</p>}

      {!loading && posts.length === 0 && (
        <p className="text-gray-600">لا توجد منشورات حالياً.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: any) => {
          const remaining = post.requiredMeals - post.collectedMeals;
          const progress = Math.min(
            Math.round((post.collectedMeals / post.requiredMeals) * 100),
            100
          );

          return (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 border border-emerald-100 overflow-hidden animate-fadeIn"
            >
              <div className="p-5">

                {/* Badge */}
                {post.status === "Completed" && (
                  <div className="bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-1 rounded-full w-fit mb-3 shadow">
                    مكتمل ✔
                  </div>
                )}

                <h2 className="text-xl font-semibold text-emerald-700 mb-2">
                  {post.title}
                </h2>

                <p className="text-gray-600 mb-2">{post.description}</p>

                <p className="text-gray-700 font-medium mb-2">
                  الملجأ: {post.shelterName}
                </p>

                <p className="text-emerald-700 font-bold">
                  عدد الوجبات المطلوبة: {post.requiredMeals}
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mt-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-700 ${
                      post.status === "Completed"
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                        : "bg-gradient-to-r from-emerald-500 to-emerald-700"
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  {post.collectedMeals} / {post.requiredMeals} وجبة
                </p>

                {post.status === "Completed" ? (
                  <p className="text-emerald-700 font-semibold mt-4 text-center text-lg">
                     تم جمع جميع الوجبات المطلوبة 
                     <br/> "شكراً لدعمكم"
                  </p>
                ) : (
                  <button
                    className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-all"
                    onClick={() => openDonateModal(post.id)}
                  >
                    التبرع لهذا الملجأ
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Donate Modal */}
      {showDonateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center animate-fadeIn">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg animate-scaleIn">

            <h2 className="text-xl font-bold text-emerald-700 mb-4">
              إدخال عدد الوجبات
            </h2>

            <input
              type="number"
              className="w-full border p-2 rounded mb-4"
              placeholder="عدد الوجبات"
              value={meals}
              onChange={(e) => setMeals(e.target.value)}
            />

            <button
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-all"
              onClick={handleDonateSubmit}
            >
              تأكيد التبرع
            </button>

            <button
              className="w-full mt-2 bg-gray-300 py-2 rounded-lg hover:bg-gray-400 transition-all"
              onClick={() => setShowDonateModal(false)}
            >
              إلغاء
            </button>

          </div>
        </div>
      )}

    </>
  );
}
