import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { Shelter } from "@/types/Shelter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../../contexts/AuthContext";
import { getAllShelterRequests } from "../../api/Admin/Shelter/getAllShelterRequests";
import { getPendingShelterRequests } from "../../api/Admin/Shelter/getPendingShelterRequests";
import { approveShelterRequest } from "../../api/Admin/Shelter/approveShelterRequest";
import { rejectShelterRequest } from "../../api/Admin/Shelter/rejectShelterRequest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShelterCard from "../../components/Shelters/ShelterCard";

const SheltersPage: React.FC = () => {
  const { user } = useAuth();
  const token = user?.token || "";
  const [allShelters, setAllShelters] = useState<Shelter[]>([]);
  const [pendingShelters, setPendingShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const { toast } = useToast();

  // 🔍 البحث
  const [searchTerm, setSearchTerm] = useState("");

  const fetchShelters = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [all, pending] = await Promise.all([
        getAllShelterRequests(),
        getPendingShelterRequests(),
      ]);

      setAllShelters(Array.isArray(all) ? all : []);
      setPendingShelters(Array.isArray(pending) ? pending : []);
    } catch (error) {
      toast({
        title: "خطأ في جلب البيانات",
        description: "فشل في تحميل بيانات الملاجئ.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, [token]);

  // ✅ فلترة حسب الاسم أو الـ ID
  const approvedShelters = allShelters.filter((s) => (s.status || '').toLowerCase() === 'approved');
  const rejectedShelters = allShelters.filter((s) => (s.status || '').toLowerCase() === 'rejected');

  const filteredAllShelters = searchTerm
    ? allShelters.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.id === Number(searchTerm)
      )
    : allShelters;

  const filteredPendingShelters = searchTerm
    ? pendingShelters.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.id === Number(searchTerm)
      )
    : pendingShelters;

  const filteredApprovedShelters = searchTerm
    ? approvedShelters.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.id === Number(searchTerm)
      )
    : approvedShelters;

  const filteredRejectedShelters = searchTerm
    ? rejectedShelters.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.id === Number(searchTerm)
      )
    : rejectedShelters;

  const handleApprove = async (id: number) => {
    try {
      await approveShelterRequest(id);
      setPendingShelters(pendingShelters.filter((s) => s.id !== id));
      toast({ title: "تمت الموافقة", description: "تمت الموافقة على الملجأ." });
    } catch {
      toast({ title: "خطأ", description: "فشل في الموافقة.", variant: "destructive" });
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectShelterRequest(id);
      setPendingShelters(pendingShelters.filter((s) => s.id !== id));
      toast({ title: "تم الرفض", description: "تم رفض الملجأ." });
    } catch {
      toast({ title: "خطأ", description: "فشل في الرفض.", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout title="إدارة الملاجئ">
     
   
      {/* مربع البحث */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="ابحث باسم الملجأ أو رقم ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-72 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg mb-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">إدارة الملاجئ</h1>
            <p className="text-sm text-slate-500 mt-1">عرض الطلبات حسب الحالة</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Pending', value: 'pending', count: pendingShelters.length },
              { label: 'Approved', value: 'approved', count: approvedShelters.length },
              { label: 'Rejected', value: 'rejected', count: rejectedShelters.length },
              { label: 'All', value: 'all', count: allShelters.length },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value as any)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === option.value
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue={statusFilter} value={statusFilter} className="w-full" onValueChange={(value) => setStatusFilter(value as any)}>
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="pending">قيد الانتظار ({pendingShelters.length})</TabsTrigger>
          <TabsTrigger value="approved">المقبولين ({approvedShelters.length})</TabsTrigger>
          <TabsTrigger value="rejected">المرفوضين ({rejectedShelters.length})</TabsTrigger>
          <TabsTrigger value="all">الكل ({allShelters.length})</TabsTrigger>
        </TabsList>

        {/* تبويب الطلبات المعلقة */}
        <TabsContent value="pending" className="mt-6">
          {filteredPendingShelters.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">لا توجد طلبات قيد الانتظار</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPendingShelters.map((shelter) => (
                <ShelterCard
                  key={shelter.id}
                  shelter={shelter}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {filteredApprovedShelters.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">لا توجد ملاجئ مقبولة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApprovedShelters.map((shelter) => (
                <ShelterCard key={shelter.id} shelter={shelter} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          {filteredRejectedShelters.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">لا توجد ملاجئ مرفوضة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRejectedShelters.map((shelter) => (
                <ShelterCard key={shelter.id} shelter={shelter} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* تبويب جميع الملاجئ */}
        <TabsContent value="all" className="mt-6">
          {filteredAllShelters.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">لا توجد ملاجئ</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAllShelters.map((shelter) => (
                <ShelterCard key={shelter.id} shelter={shelter} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default SheltersPage;
