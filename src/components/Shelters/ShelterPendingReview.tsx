export default function ShelterPendingReview({
  shelterName,
  profileImage,
}: {
  shelterName: string;
  profileImage: string;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full text-center">
        <img
          src={profileImage}
          alt="Proof"
          className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border"
        />

        <h2 className="text-2xl font-bold mb-2">طلبك قيد المراجعة</h2>

        <p className="text-gray-600 mb-4">
          شكراً لك <span className="font-semibold">{shelterName}</span>  
          لقد تم استلام طلبك وهو الآن قيد المراجعة من قبل الجمعية.
        </p>

        <p className="text-sm text-gray-500">
          سيتم إعلامك فور قبول الطلب أو رفضه.
        </p>
      </div>
    </div>
  );
}
