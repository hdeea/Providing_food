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
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "approved" | "rejected" | "all"
  >("pending");
  const { toast } = useToast();

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

  const approvedShelters = allShelters.filter(
    (s) => (s.status || "").toLowerCase() === "approved"
  );
  const rejectedShelters = allShelters.filter(
    (s) => (s.status || "").toLowerCase() === "rejected"
  );

  const filterBySearch = (list: Shelter[]) =>
    searchTerm
      ? list.filter(
          (s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.id === Number(searchTerm)
        )
      : list;

  const filteredAllShelters = filterBySearch(allShelters);
  const filteredPendingShelters = filterBySearch(pendingShelters);
  const filteredApprovedShelters = filterBySearch(approvedShelters);
  const filteredRejectedShelters = filterBySearch(rejectedShelters);

  const handleApprove = async (id: number) => {
    try {
      await approveShelterRequest(id);
      setPendingShelters(pendingShelters.filter((s) => s.id !== id));
      toast({ title: "تمت الموافقة", description: "تمت الموافقة على الملجأ." });
    } catch {
      toast({
        title: "خطأ",
        description: "فشل في الموافقة.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectShelterRequest(id);
      setPendingShelters(pendingShelters.filter((s) => s.id !== id));
      toast({ title: "تم الرفض", description: "تم رفض الملجأ." });
    } catch {
      toast({
        title: "خطأ",
        description: "فشل في الرفض.",
        variant: "destructive",
      });
    }
  };

  return (
    <div dir="rtl" className="text-right">
      <DashboardLayout title="إدارة الملاجئ">

        {/* 🔍 مربع البحث */}
        <div className="flex justify-start mb-6">
          <input
            type="text"
            placeholder="ابحث باسم الملجأ أو رقم الطلب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-right shadow-sm"
          />
        </div>

        {/* ⭐ التبويبات */}
        <Tabs
          defaultValue={statusFilter}
          value={statusFilter}
          className="w-full"
          onValueChange={(value) => setStatusFilter(value as any)}
        >
          <TabsList className="flex justify-start gap-3 mb-6">
            <TabsTrigger
              value="pending"
              className="px-4 py-2 rounded-xl border border-gray-300 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
            >
              قيد الانتظار ({pendingShelters.length})
            </TabsTrigger>

            <TabsTrigger
              value="approved"
              className="px-4 py-2 rounded-xl border border-gray-300 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              المقبولين ({approvedShelters.length})
            </TabsTrigger>

            <TabsTrigger
              value="rejected"
              className="px-4 py-2 rounded-xl border border-gray-300 data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              المرفوضين ({rejectedShelters.length})
            </TabsTrigger>

            <TabsTrigger
              value="all"
              className="px-4 py-2 rounded-xl border border-gray-300 data-[state=active]:bg-slate-800 data-[state=active]:text-white"
            >
              الكل ({allShelters.length})
            </TabsTrigger>
          </TabsList>

          {/* 🟡 قيد الانتظار */}
          <TabsContent value="pending">
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

          {/* 🟢 المقبولين */}
          <TabsContent value="approved">
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

          {/* 🔴 المرفوضين */}
          <TabsContent value="rejected">
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

          {/* ⚪ الكل */}
          <TabsContent value="all">
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
    </div>
  );
};

export default SheltersPage;
