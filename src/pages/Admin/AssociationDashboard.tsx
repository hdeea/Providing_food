import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import VouchersList from '../../components/Vouchers/VouchersList';
import IndividualRequestsTable from '../../components/Individual/IndividualRequestsTable';
import IndividualDonorsTable from '../../components/Individual/IndividualDonorsTable';
import VoucherIssuanceForm from '../../components/Vouchers/VoucherIssuanceForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { VoucherIssuance, HelpRequest, DonationIndividualDto } from '../../types/individual';
import { Heart, Ticket, Users, UserPlus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { getIndividualDonations } from '../../api/getDonationIndividuals';
import { updateDonationStatus } from '../../api/updateDonationStatus';
import { fetchAllFoodVouchers } from '@/api/foodVoucher/getAllVouchers';
import AdminStoreRequestsTable from "@/pages/Admin/AdminStoreRequestsTable";
import AdminAllStoreRequestsTable from "./AdminAllStoreRequestsTable";
import { useNavigate } from "react-router-dom";
import AdminRestaurantRequestsTable from "@/pages/Admin/Restaurant/AdminRestaurantRequestsTable";
import { getPendingRestaurantRequests } from "@/api/Admin/Restaurant/getPendingRequests";
//  استيراد المستفيدين
import { getAllBeneficiaryRequests } from "@/api/Admin/Beneficiary/getAllBeneficiaryRequests";
import { approveBeneficiaryRequest } from "@/api/Admin/Beneficiary/approveBeneficiaryRequest";
import { rejectBeneficiaryRequest } from "@/api/Admin/Beneficiary/rejectBeneficiaryRequest";
import RequestsCards from "@/components/Requests/RequestsCards";
import { getAllRestaurantRequests } from '@/api/Admin/Restaurant/getAllRequests';

const AssociationDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<VoucherIssuance[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [donors, setDonors] = useState<DonationIndividualDto[]>([]);
  const { toast } = useToast();
const [restaurantRequests, setRestaurantRequests] = useState([]);
const [pendingRestaurants, setPendingRestaurants] = useState([]);
useEffect(() => {
  const fetchPendingRestaurants = async () => {
    try {
      const data = await getPendingRestaurantRequests();
      setPendingRestaurants(data);
    } catch (error) {
      console.error("Failed to fetch pending restaurant requests:", error);
    }
  };

  fetchPendingRestaurants();
}, []);


useEffect(() => {
  const fetchRestaurants = async () => {
    try {
      const data = await getAllRestaurantRequests();
      setRestaurantRequests(data);
    } catch (error) {
      console.error("Failed to fetch restaurant requests:", error);
    }
  };

  fetchRestaurants();
}, []);

  const pendingHelpRequestsCount = helpRequests.filter(r => r.status === 'pending').length;
  const pendingDonationsCount = donors.filter(d => (d.status || '').toLowerCase() === 'pending').length;
  const acceptedHelpRequestsCount = helpRequests.filter(r => r.status === 'approved').length;
  const acceptedDonationsCount = donors.filter(d => (d.status || '').toLowerCase() === 'approved').length;
  const rejectedHelpRequestsCount = helpRequests.filter(r => r.status === 'rejected').length;
  const rejectedDonationsCount = donors.filter(d => (d.status || '').toLowerCase() === 'rejected').length;
  const acceptedRestaurantRequestsCount = restaurantRequests.filter((r: any) => (r.status || '').toLowerCase() === 'approved').length;
  const rejectedRestaurantRequestsCount = restaurantRequests.filter((r: any) => (r.status || '').toLowerCase() === 'rejected').length;
  const totalAcceptedCount = acceptedHelpRequestsCount + acceptedDonationsCount + acceptedRestaurantRequestsCount;
  const totalRejectedCount = rejectedHelpRequestsCount + rejectedDonationsCount + rejectedRestaurantRequestsCount;
  const totalPendingCount = pendingHelpRequestsCount + pendingDonationsCount + pendingRestaurants.length;

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


<button
  onClick={() => navigate("/admin/challenges")}
  className="px-6 py-3 rounded-xl bg-yellow-500 text-white font-bold"
>
  <span>⭐</span>
  <span>Leaderboard</span>
</button>


        {/* ⭐ Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            whileHover={{ y: -4 }}
            className="group rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-[0_20px_50px_-20px_rgba(16,185,129,0.6)] transition-all duration-500 hover:shadow-[0_30px_80px_-30px_rgba(16,185,129,0.55)] dark:border-emerald-500/30 dark:from-emerald-950 dark:to-slate-900"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide dark:text-emerald-400">Accepted Requests</p>
                <p className="text-4xl font-black text-slate-900 mt-2 dark:text-slate-100">{totalAcceptedCount}</p>
                <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Total approved items</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 ring-1 ring-emerald-200/80 dark:bg-emerald-800 dark:ring-emerald-500/30">
                <Sparkles className="h-7 w-7 text-emerald-700 dark:text-emerald-300" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="group rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-[0_20px_50px_-20px_rgba(245,158,11,0.6)] transition-all duration-500 hover:shadow-[0_30px_80px_-30px_rgba(245,158,11,0.55)] dark:border-amber-500/30 dark:from-amber-950 dark:to-slate-900"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide dark:text-amber-400">Pending Requests</p>
                <p className="text-4xl font-black text-slate-900 mt-2 dark:text-slate-100">{totalPendingCount}</p>
                <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">All current waiting requests</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 ring-1 ring-amber-200/80 dark:bg-amber-800 dark:ring-amber-500/30">
                <UserPlus className="h-7 w-7 text-amber-700 dark:text-amber-300" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            whileHover={{ y: -4 }}
            className="group rounded-[2rem] border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-6 shadow-[0_20px_50px_-20px_rgba(239,68,68,0.4)] transition-all duration-500 hover:shadow-[0_30px_80px_-30px_rgba(239,68,68,0.45)] dark:border-rose-500/30 dark:from-rose-950 dark:to-slate-900"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-rose-600 uppercase tracking-wide dark:text-rose-400">Restaurant Requests</p>
                <p className="text-4xl font-black text-slate-900 mt-2 dark:text-slate-100">{restaurantRequests.length}</p>
                <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Total restaurant applications</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 ring-1 ring-rose-200/80 dark:bg-rose-800 dark:ring-rose-500/30">
                <span className="text-2xl">🍽️</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="group rounded-[2rem] border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-[0_20px_50px_-20px_rgba(59,130,246,0.4)] transition-all duration-500 hover:shadow-[0_30px_80px_-30px_rgba(59,130,246,0.45)] dark:border-blue-500/30 dark:from-blue-950 dark:to-slate-900"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide dark:text-blue-400">Help Requests</p>
                <p className="text-4xl font-black text-slate-900 mt-2 dark:text-slate-100">{helpRequests.length}</p>
                <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Beneficiary support needs</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 ring-1 ring-blue-200/80 dark:bg-blue-800 dark:ring-blue-500/30">
                <Users className="h-8 w-8 text-blue-700 dark:text-blue-300" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
            whileHover={{ y: -4 }}
            className="group rounded-[2rem] border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-6 shadow-[0_20px_50px_-20px_rgba(244,63,94,0.4)] transition-all duration-500 hover:shadow-[0_30px_80px_-30px_rgba(244,63,94,0.45)] dark:border-rose-500/30 dark:from-rose-950 dark:to-slate-900"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-rose-600 uppercase tracking-wide dark:text-rose-400">Donations</p>
                <p className="text-4xl font-black text-slate-900 mt-2 dark:text-slate-100">{donors.length}</p>
                <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Individual donor offers</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 ring-1 ring-rose-200/80 dark:bg-rose-800 dark:ring-rose-500/30">
                <Heart className="h-8 w-8 text-rose-700 dark:text-rose-300" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            whileHover={{ y: -4 }}
            className="group rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-[0_20px_50px_-20px_rgba(234,179,8,0.4)] transition-all duration-500 hover:shadow-[0_30px_80px_-30px_rgba(234,179,8,0.45)] dark:border-amber-500/30 dark:from-amber-950 dark:to-slate-900"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide dark:text-amber-400">Pending Reviews</p>
                <p className="text-4xl font-black text-slate-900 mt-2 dark:text-slate-100">{[...helpRequests, ...donors].filter(r => r.status === 'pending').length}</p>
                <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Awaiting your decision</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 ring-1 ring-amber-200/80 dark:bg-amber-800 dark:ring-amber-500/30">
                <UserPlus className="h-8 w-8 text-amber-700 dark:text-amber-300" />
              </div>
            </div>
          </motion.div>
        </div>

  
       

        {/* ⭐ Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-slate-100 p-1 rounded-2xl dark:bg-slate-700">
            <TabsTrigger value="overview" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-md transition dark:data-[state=active]:bg-slate-600 dark:data-[state=active]:text-emerald-300">
              📊 Overview
            </TabsTrigger>
            <TabsTrigger value="restaurants" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-rose-700 data-[state=active]:shadow-md transition dark:data-[state=active]:bg-slate-600 dark:data-[state=active]:text-rose-300">
              🍽️ Restaurants ({pendingRestaurants.length})
            </TabsTrigger>
            <TabsTrigger value="stores" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-md transition dark:data-[state=active]:bg-slate-600 dark:data-[state=active]:text-amber-300">
              🏪 Stores
            </TabsTrigger>
            <TabsTrigger value="beneficiaries" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md transition dark:data-[state=active]:bg-slate-600 dark:data-[state=active]:text-blue-300">
              👥 Beneficiaries
            </TabsTrigger>
            <TabsTrigger value="shelters" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md transition dark:data-[state=active]:bg-slate-600 dark:data-[state=active]:text-purple-300">
              🏠 Shelters
            </TabsTrigger>
            <TabsTrigger value="vouchers" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-md transition dark:data-[state=active]:bg-slate-600 dark:data-[state=active]:text-emerald-300">
              <Ticket className="w-4 h-4" /> Vouchers
            </TabsTrigger>
            <TabsTrigger value="help-requests" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md transition dark:data-[state=active]:bg-slate-600 dark:data-[state=active]:text-blue-300">
              <Users className="w-4 h-4" /> Help Requests
            </TabsTrigger>
          </TabsList>

          {/* ⭐ Overview */}
          <TabsContent value="overview" className="mt-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-800">
                    <span className="text-xl">📊</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Dashboard Overview</h2>
                    <p className="text-sm text-slate-600 mt-1 dark:text-slate-400">Comprehensive view of all platform activities and metrics</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-800">
                        <Ticket className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">New Voucher Issued</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Food voucher created for beneficiary</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
                        <Users className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">Help Request Submitted</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">New beneficiary assistance request</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-800">
                        <Heart className="h-5 w-5 text-rose-700 dark:text-rose-300" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">Donation Received</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Individual donation processed</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition dark:bg-emerald-900 dark:hover:bg-emerald-800">
                      <Ticket className="h-8 w-8 text-emerald-700 dark:text-emerald-300" />
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Issue Voucher</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition dark:bg-blue-900 dark:hover:bg-blue-800">
                      <Users className="h-8 w-8 text-blue-700 dark:text-blue-300" />
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Review Requests</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-rose-50 hover:bg-rose-100 transition dark:bg-rose-900 dark:hover:bg-rose-800">
                      <Heart className="h-8 w-8 text-rose-700 dark:text-rose-300" />
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Manage Donations</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-amber-50 hover:bg-amber-100 transition dark:bg-amber-900 dark:hover:bg-amber-800">
                      <span className="text-xl">🏪</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Store Requests</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          {/* ⭐ Restaurants */}
          <TabsContent value="restaurants" className="mt-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-800">
                    <span className="text-xl">🍽️</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Restaurant Requests</h2>
                    <p className="text-sm text-slate-600 mt-1 dark:text-slate-400">
                      Review and process restaurant join requests
                    </p>
                  </div>
                </div>
              </div>

              <AdminRestaurantRequestsTable />
            </div>
          </TabsContent>


          {/* ⭐ Stores */}
          <TabsContent value="stores" className="mt-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-800">
                    <span className="text-xl">🏪</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Store Requests</h2>
                    <p className="text-sm text-slate-600 mt-1 dark:text-slate-400">Review and process store donation and supply requests</p>
                  </div>
                </div>
              </div>
              <AdminStoreRequestsTable />
            </div>
          </TabsContent>

          {/* ⭐ Beneficiaries */}
          <TabsContent value="beneficiaries" className="mt-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-800">
                    <Users className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Beneficiaries</h2>
                    <p className="text-sm text-slate-600 mt-1 dark:text-slate-400">Manage beneficiary assistance requests and review applications</p>
                  </div>
                </div>
              </div>
              <RequestsCards
                requests={helpRequests}
                onStatusChange={handleHelpRequestStatusChange}
              />
            </div>
          </TabsContent>

          {/* ⭐ Shelters */}
          <TabsContent value="shelters" className="mt-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-800">
                    <span className="text-xl">🏠</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Shelters</h2>
                    <p className="text-sm text-slate-600 mt-1 dark:text-slate-400">Manage shelter operations and beneficiary accommodations</p>
                  </div>
                </div>
              </div>
              <div className="text-center py-12">
                <span className="text-6xl">🏠</span>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-4">Shelter Management</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Shelter management features coming soon</p>
              </div>
            </div>
          </TabsContent>

          {/* ⭐ Vouchers */}
          <TabsContent value="vouchers" className="space-y-6 mt-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-800">
                  <Ticket className="h-6 w-6 text-emerald-700 dark:text-emerald-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Food Vouchers Management</h2>
                  <p className="text-sm text-slate-600 mt-1 dark:text-slate-400">Create, distribute, and monitor food vouchers for beneficiaries</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 dark:text-slate-100">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-600"></span>
                    Active Vouchers
                  </h3>
                  <VouchersList vouchers={vouchers} />
                </div>
              </div>

              <div>
                <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 shadow-lg h-full dark:border-emerald-800 dark:bg-emerald-900">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 dark:text-slate-100">
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

          {/* ⭐ Help Requests */}
          <TabsContent value="help-requests" className="mt-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-800">
                    <Users className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Help Requests</h2>
                    <p className="text-sm text-slate-600 mt-1 dark:text-slate-400">Manage beneficiary assistance requests and review applications</p>
                  </div>
                </div>
              </div>
              <RequestsCards
                requests={helpRequests}
                onStatusChange={handleHelpRequestStatusChange}
              />
            </div>
          </TabsContent>


        </Tabs>
      </div>
    </DashboardLayout>
  );
};
export default AssociationDashboard;
