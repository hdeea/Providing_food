import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { getAllBeneficiaryRequests } from '@/api/Admin/Beneficiary/getAllBeneficiaryRequests';
import { HelpRequest } from '@/types/individual';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Users, Calendar, Eye, CheckCircle } from 'lucide-react';

const BeneficiariesPage: React.FC = () => {
  const [beneficiaries, setBeneficiaries] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        setLoading(true);
        const data = await getAllBeneficiaryRequests();
        console.log("Beneficiaries data:", data);
        // Filter only approved requests
        const approved = data.filter((b: HelpRequest) => (b.status || '').toLowerCase() === 'approved');
        setBeneficiaries(approved);
      } catch (error) {
        toast({
          title: 'خطأ',
          description: 'فشل تحميل بيانات المستفيدين',
          variant: 'destructive',
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeneficiaries();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Beneficiaries">
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
            <p className="text-slate-600 font-semibold">جاري تحميل البيانات...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Beneficiaries Management">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs text-emerald-600 font-semibold uppercase">Total Beneficiaries</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{beneficiaries.length}</p>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs text-blue-600 font-semibold uppercase">Family Members</p>
            <p className="text-2xl font-black text-blue-700 mt-1">
              {beneficiaries.reduce((sum, b) => sum + (b.numberOfPeople || 0), 0)}
            </p>
          </div>
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
            <p className="text-xs text-purple-600 font-semibold uppercase">Status</p>
            <p className="text-2xl font-black text-purple-700 mt-1">Active</p>
          </div>
        </div>

        {/* Cards Grid */}
        {beneficiaries.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-30 text-slate-400" />
            <p className="text-slate-600 font-semibold">لا توجد طلبات مقبولة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {beneficiaries.map((beneficiary) => (
              <div key={beneficiary.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg hover:shadow-xl transition">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                      <User className="h-5 w-5 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">{beneficiary.name}</h3>
                      <p className="text-sm text-slate-500">ID: #{beneficiary.id}</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-semibold">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approved
                  </Badge>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">{beneficiary.phone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">{beneficiary.numberOfPeople} أفراد العائلة</span>
                  </div>

                  <div className="text-sm text-slate-600">
                    <span className="font-semibold">الحالة الاجتماعية:</span> {beneficiary.maritalStatus}
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">
                      {beneficiary.createdAt ? new Date(beneficiary.createdAt).toLocaleDateString('ar-SA') : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Images */}
                {(beneficiary.maritalStatusImage || beneficiary.familySizeImage) && (
                  <div className="grid grid-cols-2 gap-3">
                    {beneficiary.maritalStatusImage && (
                      <div className="relative group">
                        <img
                          src={beneficiary.maritalStatusImage}
                          alt="Marital Status Proof"
                          className="w-full h-20 object-cover rounded-lg border border-slate-200"
                          onError={(e) => (e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e2e8f0" width="100" height="100"/%3E%3C/svg%3E')}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}

                    {beneficiary.familySizeImage && (
                      <div className="relative group">
                        <img
                          src={beneficiary.familySizeImage}
                          alt="Family Size Proof"
                          className="w-full h-20 object-cover rounded-lg border border-slate-200"
                          onError={(e) => (e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e2e8f0" width="100" height="100"/%3E%3C/svg%3E')}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BeneficiariesPage;
