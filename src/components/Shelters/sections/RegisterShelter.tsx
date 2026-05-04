
    export default function ShelterRegister({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {  return (


    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800">تقديم طلب اعتماد</h1>

      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
<ShelterRegister onSuccess={() => window.location.reload()} />
      </div>
    </div>
  );
}