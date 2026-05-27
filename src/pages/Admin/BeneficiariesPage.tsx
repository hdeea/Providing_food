import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { getAllBeneficiaryRequests } from "@/api/Admin/Beneficiary/getAllBeneficiaryRequests";
import { approveBeneficiaryRequest } from "@/api/Admin/Beneficiary/approveBeneficiaryRequest";
import { rejectBeneficiaryRequest } from "@/api/Admin/Beneficiary/rejectBeneficiaryRequest";

export default function BeneficiariesManagement() {
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllBeneficiaryRequests();

        const BASE_URL = "https://localhost:7060";

        const mapped = data.map((item: any) => ({
          id: item.requestId,
          name: item.fullName,
          phone: item.phoneNumber,
          familySize: item.familySize,
          maritalStatus: item.maritalStatus,
          status: item.status.toLowerCase(),
          createdAt: item.createdDate,

          // ⭐ الصور بعد التعديل
          maritalStatusProofImage: item.maritalStatusProofImage
            ? BASE_URL + item.maritalStatusProofImage
            : null,

          familySizeProofImage: item.familySizeProofImage
            ? BASE_URL + item.familySizeProofImage
            : null,
        }));

        setBeneficiaries(mapped);
      } catch (error) {
        console.error("Failed to load beneficiaries:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleApprove = async (id: number) => {
    await approveBeneficiaryRequest(id);
    setBeneficiaries((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "approved" } : b))
    );
  };

  const handleReject = async (id: number) => {
    await rejectBeneficiaryRequest(id);
    setBeneficiaries((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "rejected" } : b))
    );
  };

  const pendingCount = beneficiaries.filter((b) => b.status === "pending").length;
  const approvedCount = beneficiaries.filter((b) => b.status === "approved").length;
  const rejectedCount = beneficiaries.filter((b) => b.status === "rejected").length;

  const filtered =
    statusFilter === "all"
      ? beneficiaries
      : beneficiaries.filter((b) => b.status === statusFilter);

  if (loading)
    return (
      <DashboardLayout title="Beneficiaries Management">
        <div className="flex justify-center py-16 text-slate-600 font-semibold">
          Loading...
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout title="Beneficiaries Management">
      {/* ⭐ Statistics Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-slate-50 border rounded-2xl mb-6">
        <div className="rounded-xl p-4 bg-amber-50 border border-amber-200 text-center">
          <p className="text-xs text-amber-700 font-semibold uppercase">Pending</p>
          <p className="text-3xl font-black text-amber-800">{pendingCount}</p>
        </div>

        <div className="rounded-xl p-4 bg-emerald-50 border border-emerald-200 text-center">
          <p className="text-xs text-emerald-700 font-semibold uppercase">Approved</p>
          <p className="text-3xl font-black text-emerald-800">{approvedCount}</p>
        </div>

        <div className="rounded-xl p-4 bg-red-50 border border-red-200 text-center">
          <p className="text-xs text-red-700 font-semibold uppercase">Rejected</p>
          <p className="text-3xl font-black text-red-800">{rejectedCount}</p>
        </div>
      </div>

      {/* ⭐ Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Pending", value: "pending", count: pendingCount },
            { label: "Approved", value: "approved", count: approvedCount },
            { label: "Rejected", value: "rejected", count: rejectedCount },
            { label: "All", value: "all", count: beneficiaries.length },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value as any)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                statusFilter === option.value
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>
      </div>

      {/* ⭐ Beneficiaries Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">ID #{b.id}</h3>

              {b.status === "approved" && (
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle className="w-4 h-4" /> Approved
                </span>
              )}

              {b.status === "rejected" && (
                <span className="flex items-center gap-1 text-red-700 font-semibold">
                  <XCircle className="w-4 h-4" /> Rejected
                </span>
              )}

              {b.status === "pending" && (
                <span className="flex items-center gap-1 text-amber-700 font-semibold">
                  <Clock className="w-4 h-4" /> Pending
                </span>
              )}
            </div>

            <div className="space-y-2 text-slate-700">
              <p><span className="font-semibold">الاسم:</span> {b.name}</p>
              <p><span className="font-semibold">الهاتف:</span> {b.phone}</p>
              <p><span className="font-semibold">أفراد العائلة:</span> {b.familySize}</p>
              <p><span className="font-semibold">الحالة الاجتماعية:</span> {b.maritalStatus}</p>
              <p><span className="font-semibold">تاريخ الطلب:</span> {b.createdAt}</p>
            </div>

            {/* ⭐ Images */}
           <div className="mt-4 flex gap-3">
  {b.maritalStatusProofImage && (
    <img
      src={b.maritalStatusProofImage}
      onClick={() => setPreviewImage(b.maritalStatusProofImage)}
      className="w-24 h-24 rounded-lg border object-cover cursor-pointer hover:opacity-80 transition"
    />
  )}

  {b.familySizeProofImage && (
    <img
      src={b.familySizeProofImage}
      onClick={() => setPreviewImage(b.familySizeProofImage)}
      className="w-24 h-24 rounded-lg border object-cover cursor-pointer hover:opacity-80 transition"
    />
  )}
</div>


            {/* ⭐ Actions */}
            {b.status === "pending" && (
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={() => handleApprove(b.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1 rounded-lg text-sm shadow"
                >
                  موافقة
                </button>
                <button
                  onClick={() => handleReject(b.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg text-sm shadow"
                >
                  رفض
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {previewImage && (
  <div
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    onClick={() => setPreviewImage(null)}
  >
    <div className="relative">
      <img
        src={previewImage}
        className="max-w-[90vw] max-height-[90vh] rounded-xl shadow-2xl border-4 border-white"
      />

      <button
        onClick={() => setPreviewImage(null)}
        className="absolute top-2 right-2 bg-white text-black px-3 py-1 rounded-lg shadow"
      >
        إغلاق
      </button>
    </div>
  </div>
)}

    </DashboardLayout>
  );
}
