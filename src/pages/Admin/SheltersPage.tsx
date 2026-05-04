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

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending">
            الطلبات قيد الانتظار ({pendingShelters.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            جميع الملاجئ ({allShelters.length})
          </TabsTrigger>
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
