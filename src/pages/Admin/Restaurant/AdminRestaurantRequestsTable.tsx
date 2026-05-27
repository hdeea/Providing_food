import { useEffect, useState } from "react";
import { RestaurantRequest } from "@/types/restaurant";
import { getAllRestaurantRequests } from "@/api/Admin/Restaurant/getAllRequests";
import { approveRestaurantRequest } from "@/api/Admin/Restaurant/approveRequest";
import { rejectRestaurantRequest } from "@/api/Admin/Restaurant/rejectRequest";
import { UserPlus } from "lucide-react";

export default function AdminRestaurantRequestsTable() {
  const [requests, setRequests] = useState<RestaurantRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const loadData = async () => {
    try {
      const data = await getAllRestaurantRequests();
      setRequests(
        data.map((req) => ({
          ...req,
          status: (req.status || '').toLowerCase() as RestaurantRequest['status'],
        }))
      );
    } catch (error) {
      console.error("Failed to load restaurant requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: number) => {
    await approveRestaurantRequest(id);
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    );
  };

  const handleReject = async (id: number) => {
    await rejectRestaurantRequest(id);
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r))
    );
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  const filteredRequests =
    statusFilter === 'all'
      ? requests
      : requests.filter(r => r.status === statusFilter);

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">

      
      {/*  Header + Filters */}
      <div className="border-b border-slate-200 px-6 py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Restaurant Requests</h1>
          <p className="text-sm text-slate-500 mt-1">عرض الطلبات حسب الحالة</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Pending', value: 'pending', count: pendingCount },
            { label: 'Approved', value: 'approved', count: approvedCount },
            { label: 'Rejected', value: 'rejected', count: rejectedCount },
            { label: 'All', value: 'all', count: requests.length },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value as any)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                statusFilter === option.value
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>
      </div>

    

      {/* ⭐ Table */}
      {filteredRequests.length === 0 ? (
        <div className="px-6 py-20 text-center text-slate-500">
          لا توجد طلبات في هذا العرض.
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-600 text-xs uppercase tracking-wide">
              <th className="p-4 text-center">ID</th>
              <th className="p-4 text-center">اسم المطعم</th>
              <th className="p-4 text-center">العنوان</th>
              <th className="p-4 text-center">الوصف</th>
              <th className="p-4 text-center">البريد</th>
              <th className="p-4 text-center">الهاتف</th>
              <th className="p-4 text-center">الصورة</th>
              <th className="p-4 text-center">الحالة</th>
              <th className="p-4 text-center">تاريخ الإنشاء</th>
              <th className="p-4 text-center">إجراءات</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequests.map((req, index) => {
              const statusKey = req.status;

              return (
                <tr key={req.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                  <td className="p-4 text-center">{req.id}</td>
                  <td className="p-4 text-center">{req.restaurantName}</td>
                  <td className="p-4 text-center">{req.address}</td>
                  <td className="p-4 text-center">{req.description}</td>
                  <td className="p-4 text-center">{req.restaurantEmail || '-'}</td>
                  <td className="p-4 text-center">{req.restaurantPhone || '-'}</td>
                  <td className="p-4 text-center">
                    <img src={req.licenseImagePath} className="w-14 h-14 rounded-lg border shadow-sm object-cover" />
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      statusKey === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : statusKey === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {statusKey}
                    </span>
                  </td>
                  <td className="p-4 text-center">{req.createdAt}</td>

                  {/* ⭐ Actions */}
                  <td className="p-4 text-center">
                    {statusKey === 'pending' && (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg text-xs shadow"
                        >
                          موافقة
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg text-xs shadow"
                        >
                          رفض
                        </button>
                      </div>
                    )}

                    {statusKey === 'approved' && (
                      <span className="text-green-700 font-semibold text-sm">✔️ تم القبول</span>
                    )}

                    {statusKey === 'rejected' && (
                      <span className="text-red-700 font-semibold text-sm">✖️ تم الرفض</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
