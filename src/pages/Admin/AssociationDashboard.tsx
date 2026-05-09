import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import VouchersList from '../../components/Vouchers/VouchersList';
import IndividualRequestsTable from '../../components/Individual/IndividualRequestsTable';
import IndividualDonorsTable from '../../components/Individual/IndividualDonorsTable';
import VoucherIssuanceForm from '../../components/Vouchers/VoucherIssuanceForm';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { VoucherIssuance, HelpRequest, DonationIndividualDto } from '../../types/individual';
import { Heart, Ticket, Users, UserPlus } from 'lucide-react';
import { getIndividualDonations } from '../../api/getDonationIndividuals';
import { updateDonationStatus } from '../../api/updateDonationStatus';
import { fetchAllFoodVouchers } from '@/api/foodVoucher/getAllVouchers';
import AdminStoreRequestsTable from "@/pages/Admin/AdminStoreRequestsTable";
import AdminAllStoreRequestsTable from "./AdminAllStoreRequestsTable";
import { useNavigate } from "react-router-dom";

//  استيراد المستفيدين
import { getAllBeneficiaryRequests } from "@/api/Admin/Beneficiary/getAllBeneficiaryRequests";
import { approveBeneficiaryRequest } from "@/api/Admin/Beneficiary/approveBeneficiaryRequest";
import { rejectBeneficiaryRequest } from "@/api/Admin/Beneficiary/rejectBeneficiaryRequest";
import RequestsCards from "@/components/Requests/RequestsCards";

const AssociationDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<VoucherIssuance[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [donors, setDonors] = useState<DonationIndividualDto[]>([]);
  const { toast } = useToast();

  //   Vouchers
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await fetchAllFoodVouchers();
        setVouchers(data);
      } catch (error) {
        console.error("Failed to fetch vouchers:", error);
      }
    };
    fetchVouchers();
  }, []);

  //  Individual Donations
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await getIndividualDonations();
        const dataWithId = data.map((item) => ({
          ...item,
          id: item.foodId,
        }));
        setDonors(dataWithId);
      } catch (error) {
        console.error("Failed to fetch individual donations:", error);
      }
    };
    fetchDonations();
  }, []);

  //  Beneficiary Help Requests
useEffect(() => {
  const fetchHelpRequests = async () => {
    try {
      const data = await getAllBeneficiaryRequests();

      const mapped = data.map((item: any) => ({
        id: item.requestId,
        userId: item.userId,
        name: item.fullName,
        phone: item.phoneNumber,
        numberOfPeople: item.familySize,
        maritalStatus: item.maritalStatus,
        maritalStatusImage: item.maritalStatusProofImage,
        familySizeImage: item.familySizeProofImage,
        status: item.status.toLowerCase(),
        createdAt: item.createdDate
      }));

      setHelpRequests(mapped);
    } catch (error) {
      console.error("Failed to fetch help requests:", error);
    }
  };

  fetchHelpRequests();
}, []);

  // Update Donor Status
  const handleDonorStatusChange = async (
    requestId: number,
    newStatus: 'Approved' | 'Rejected'
  ) => {
    const donor = donors.find(d => d.requesId === requestId);
    if (!donor) return;

    try {
      await updateDonationStatus(donor.requesId, newStatus);

      setDonors(prev =>
        prev.map(d =>
          d.requesId === requestId ? { ...d, status: newStatus } : d
        )
      );

      toast({
        title: `Status updated to ${newStatus === 'Approved' ? 'Approved' : 'Rejected'}`,
      });
    } catch (error) {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    }
  };

  //  Update Help Request Status
  const handleHelpRequestStatusChange = async (
    requestId: number,
    newStatus: 'approved' | 'rejected'
  ) => {
    try {
      if (newStatus === "approved") {
        await approveBeneficiaryRequest(requestId);
      } else {
        await rejectBeneficiaryRequest(requestId);
      }

      setHelpRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );

      toast({
        title: `Status updated to ${newStatus === 'approved' ? 'Approved' : 'Rejected'}`,
      });
    } catch (error) {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout title="Association Control Panel">
      <div className="space-y-6">
 {/* زر التحديات */}
  <button
    onClick={() => navigate("/admin/challenges")}
    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow-md hover:bg-emerald-700 transition"
  >
    <span>🏆</span>
    <span>Challenges</span>
  </button>

        {/* ⭐ Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Food Vouchers</p>
                <p className="text-4xl font-black text-slate-900 mt-2">{vouchers.length}</p>
                <p className="text-xs text-slate-500 mt-1">Active vouchers</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                <Ticket className="h-8 w-8 text-emerald-700" />
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Help Requests</p>
                <p className="text-4xl font-black text-slate-900 mt-2">{helpRequests.length}</p>
                <p className="text-xs text-slate-500 mt-1">Pending review</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                <Users className="h-8 w-8 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-rose-600 uppercase tracking-wide">Donations</p>
                <p className="text-4xl font-black text-slate-900 mt-2">{donors.length}</p>
                <p className="text-xs text-slate-500 mt-1">Donor requests</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100">
                <Heart className="h-8 w-8 text-rose-700" />
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide">Pending Reviews</p>
                <p className="text-4xl font-black text-slate-900 mt-2">
                  {[...helpRequests, ...donors].filter(r => r.status === 'pending').length}
                </p>
                <p className="text-xs text-slate-500 mt-1">Awaiting action</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
                <UserPlus className="h-8 w-8 text-amber-700" />
              </div>
            </div>
          </div>
        </div>

        {/* ⭐ Tabs */}
        <Tabs defaultValue="vouchers" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-100 p-1 rounded-2xl">
            <TabsTrigger value="vouchers" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-md transition">
              <Ticket className="w-4 h-4" /> Vouchers
            </TabsTrigger>

            <TabsTrigger value="help-requests" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md transition">
              <Users className="w-4 h-4" /> Help Requests
            </TabsTrigger>

            <TabsTrigger value="donations" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-rose-700 data-[state=active]:shadow-md transition">
              <Heart className="w-4 h-4" /> Donations
            </TabsTrigger>

            <TabsTrigger value="store-requests" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-md transition">
              🏪 Store Requests
            </TabsTrigger>

            <TabsTrigger value="all-requests" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md transition">
              📋 All Requests
            </TabsTrigger>
          </TabsList>

          {/* ⭐ Beneficiary Requests */}
          <TabsContent value="help-requests" className="mt-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg">
              <div className="mb-6 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                    <Users className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Help Requests</h2>
                    <p className="text-sm text-slate-600 mt-1">Manage beneficiary assistance requests and review applications</p>
                  </div>
                </div>
              </div>
              <RequestsCards
                requests={helpRequests}
                onStatusChange={handleHelpRequestStatusChange}
              />
            </div>
          </TabsContent>

          {/* ⭐ Store Requests */}
          <TabsContent value="store-requests" className="mt-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg">
              <div className="mb-6 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
                    <span className="text-xl">🏪</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Store Requests</h2>
                    <p className="text-sm text-slate-600 mt-1">Review and process store donation and supply requests</p>
                  </div>
                </div>
              </div>
              <AdminStoreRequestsTable />
            </div>
          </TabsContent>

          {/* ⭐ All Store Requests */}
          <TabsContent value="all-requests" className="mt-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg">
              <div className="mb-6 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100">
                    <span className="text-xl">📋</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">All Requests</h2>
                    <p className="text-sm text-slate-600 mt-1">Complete view of all system requests across all platforms</p>
                  </div>
                </div>
              </div>
              <AdminAllStoreRequestsTable />
            </div>
          </TabsContent>

          {/* ⭐ Donation Requests */}
          <TabsContent value="donations" className="mt-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg">
              <div className="mb-6 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100">
                    <Heart className="h-6 w-6 text-rose-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Donation Requests</h2>
                    <p className="text-sm text-slate-600 mt-1">Approve and manage individual donor contributions and offers</p>
                  </div>
                </div>
              </div>
              <IndividualDonorsTable
                donors={donors}
                onStatusChange={handleDonorStatusChange}
              />
            </div>
          </TabsContent>

          {/* ⭐ Vouchers Management */}
          <TabsContent value="vouchers" className="space-y-6 mt-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                  <Ticket className="h-6 w-6 text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Food Vouchers Management</h2>
                  <p className="text-sm text-slate-600 mt-1">Create, distribute, and monitor food vouchers for beneficiaries</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-600"></span>
                    Active Vouchers
                  </h3>
                  <VouchersList vouchers={vouchers} />
                </div>
              </div>

              <div>
                <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 shadow-lg h-full">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-600"></span>
                    Issue New Voucher
                  </h3>
                  <VoucherIssuanceForm
                    onVoucherIssued={(newVoucher) => {
                      setVouchers((prev) => [newVoucher, ...prev]);
                    }}
                  />
                </div>
              </div>
            </div>
          </TabsContent>


        </Tabs>
      </div>
    </DashboardLayout>
  );
};
export default AssociationDashboard;
