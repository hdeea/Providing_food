import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ReactNode } from "react";

// Main Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin Pages
import BeneficiariesPage from "./pages/Admin/BeneficiariesPage";
import AssociationDashboard from "./pages/Admin/AssociationDashboard";
import { VouchersAdmin } from "./pages/Admin/VouchersAdmin";
import GiftDonationsPage from "./pages/Admin/GiftDonationsPage";
import StoresPage from "./pages/Admin/StoresPage";
import SheltersPage from "./pages/Admin/SheltersPage";
import ShelterLogin from "./pages/Auth/ShelterLogin";
import { getAllBeneficiaryRequests } from "@/api/Admin/Beneficiary/getAllBeneficiaryRequests";
import { approveBeneficiaryRequest } from "@/api/Admin/Beneficiary/approveBeneficiaryRequest";
import { rejectBeneficiaryRequest } from "@/api/Admin/Beneficiary/rejectBeneficiaryRequest";
import AdminPendingRequestsPage from "@/pages/Admin/AdminPendingRequestsPage";
import SeasonItemsPage from "@/pages/Admin/Season/SeasonItemsPage";
import BondPricePage from "@/pages/Admin/Donationstype/BondPricePage";
import CreateGiftBondPage from "@/pages/Admin/Donationstype/CreateGiftBondPage";
import AllGiftDonationsPage from "@/pages/Admin/Donationstype/AllGiftDonationsPage";
import FoodBondsPage from "@/pages/Admin/FoodBond/FoodBondsPage";


// Restaurant Pages
import DashboardPage from "./pages/Restaurant/RestaurantDashboard";
import RestaurantLogin from "./pages/Auth/RestaurantLogin";
import RestaurantRequestsPage from "./pages/Admin/Restaurant/AdminRestaurantRequestsTable";
import AddDonationPage from "./pages/Restaurant/AddDonationPage";

import FoodBondScanAndConfirm from "@/components/Scanner/FoodBondScanAndConfirm";
// Store Pages
import FoodStoreLayout from "./pages/Stores/FoodStoreLayout";
import StoreLogin from "./pages/Auth/StoreLogin";
import StoreDashboard from "./pages/Stores/StoreDashboard";
import ScanVoucher from "./pages/Stores/ScanVoucher";

// Individual (Donors)
import DonorRegistrationPage from "./pages/Individual/DonorRegistrationPage";
import TrackDonationsPage from "./pages/Individual/TrackDonationsPage";

// Beneficiary Pages (NEW)
import BeneficiaryRegisterPage from "./pages/Beneficiary/BeneficiaryRegisterPage";
import BeneficiaryLoginPage from "./pages/Beneficiary/BeneficiaryLoginPage";
import BeneficiaryDashboard from "./pages/Beneficiary/BeneficiaryDashboard";
import BeneficiarySubmitPage from "./pages/Beneficiary/BeneficiarySubmitPage";
import TrackRequestPage from "./pages/Beneficiary/TrackRequestPage";

// Donor Pages
import DonorDonateOptions from "./pages/Donor/DonorDashboard";
import DonateCashChallenge from "./pages/Donor/DonateCashChallenge";
import DonateMeals from "./pages/Donor/DonateMeals";
import DonateGift from "./pages/Donor/DonateGift";
import DonorPoints from "./pages/Donor/DonorPoints";
import Winners from "./pages/Donor/Winners";
import ChallengeStatus from "@/pages/Donor/ChallengeStatus";
import DonateBondPage from "@/pages/Donor/DonateBondPage";
import EventLanding from "./pages/Donor/days10Ramadan";
import DonationTypePage from "./pages/Donor/DonationTypePage";


// Layouts
import DashboardLayout from "./components/Layout/DashboardLayout";

// Auth Components
import { Register } from "./components/Auth/Register";
import DonorLogin from "./pages/Auth/DonorLogin";

//Gift Bond
const queryClient = new QueryClient();
import ShelterIndex from "./pages/Shelter/Index";
import ShelterDashboard from "./components/Shelters/ShelterDashboard";
import AdminChallengesPage from "./pages/Admin/Chellenge/AdminChallengePage";
import EditChallengePage from "./pages/Admin/Chellenge/EditChallengePage";
import CreateChallengePage from "./pages/Admin/Chellenge/CreateChallengePage";

import PostsPage from "./pages/Restaurant/PostsPage";
import SendJoinRequestPage from "./pages/Restaurant/SendJoinRequestPage";
import RestaurantDashboard from "./pages/Restaurant/RestaurantDashboard";
import RestaurantLayout from "./pages/Restaurant/RestaurantLayout";
import RamadanChallengeHome from "./pages/Donor/RamadanChallengeHome";

import SeasonManagementPage from "./pages/Admin/Season/SeasonManagement";
import {getAllFoodBonds} from "@/api/Admin/FoodBond/getallfoodBond";
import FoodBondDetailsPage from "@/pages/Admin/FoodBond/FoodBondDetailsPage";
import MoneyDonationsPage from "./pages/Admin/Donationstype/MoneyDonationsPage";
import VoucherScanAndRedeem from "./components/Scanner/VoucherScanAndRedeem";
import BeneficiaryBondsPage from "./pages/Beneficiary/BeneficiaryBondsPage";
import DonateCashPage from "./pages/Donor/DonateCashPage";
import RestaurantDonationsAdmin from "./pages/Admin/Restaurant/RestaurantDonationsAdmin";


// Protected Route

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}: {
  children: ReactNode;
  allowedRoles?: string[];
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const buildLoginRedirect = () => {
    const returnUrl = encodeURIComponent(location.pathname + location.search);

    if (allowedRoles.includes("donor")) {
      return `/donor/login?return=${returnUrl}`;
    }

    if (allowedRoles.includes("admin")) {
      return "/login";
    }

    if (allowedRoles.includes("restaurant")) {
      return "/restaurant/login";
    }

    if (allowedRoles.includes("beneficiary")) {
      return "/beneficiary/login";
    }

    if (allowedRoles.some((role) => role.includes("shelter"))) {
      return "/shelter/login";
    }

    if (allowedRoles.some((role) => role.includes("store"))) {
      return "/store/login";
    }

    return "/login";
  };

  if (!user) {
    return <Navigate to={buildLoginRedirect()} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/donor/login" replace />;
  }

  return <>{children}</>;
};

// Role Wrappers
const AdminRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>
);

const RestaurantRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute allowedRoles={["restaurant"]}>{children}</ProtectedRoute>
);

const StoreRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute allowedRoles={["store owner"]}>{children}</ProtectedRoute>
);

const ShelterRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute allowedRoles={["shelter owner"]}>{children}</ProtectedRoute>
);

const BeneficiaryRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute allowedRoles={["beneficiary"]}>{children}</ProtectedRoute>
);

const DonorRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute allowedRoles={["donor"]}>{children}</ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>

<Route path="/donor/login" element={<DonorLogin />} />

            {/* Donor Challenge Routes */}
            <Route
              path="/donor/status"
              element={
                <DonorRoute>
                  <ChallengeStatus />
                </DonorRoute>
              }
            />
            <Route
              path="/donor/points"
              element={
                <DonorRoute>
                  <DonorPoints />
                </DonorRoute>
              }
            />
            <Route
              path="/donor/winners"
              element={
                <DonorRoute>
                  <Winners />
                </DonorRoute>
              }
            />
            <Route
              path="/donor/donate-cash-challenge"
              element={
                <DonorRoute>
                  <DonateCashChallenge />
                </DonorRoute>
              }
            />
            <Route
              path="/donor/donation-type"
              element={
                <DonorRoute>
                  <DonationTypePage />
                </DonorRoute>
              }
            />

            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Donor (Individual) */}
            <Route path="/individual/donate" element={<DonorRegistrationPage />} />
            <Route path="/individual/track-donations" element={<TrackDonationsPage />} />
            <Route path="/admin/gift-bond/price" element={<BondPricePage />} />
            <Route path="/donor/gift-bond/create" element={<CreateGiftBondPage />} />
            <Route path="/admin/gift-bond/donations" element={<AllGiftDonationsPage />} />
            <Route path="/donate-bond" element={<DonateBondPage />} />

            <Route path="/donor/donate" element={<DonorDonateOptions />} />
            <Route path="/donor/donate/meals" element={<DonateMeals />} />
            <Route path="/donor/donate/gift" element={<DonateGift />} />
            <Route path="/donor/ramadan" element={<EventLanding />} />
<Route path="/donor/donate-cash" element={<DonateCashPage />} />

            {/* Beneficiary Routes */}
    <Route path="/beneficiary/register" element={<BeneficiaryRegisterPage />} />
<Route path="/beneficiary/login" element={<BeneficiaryLoginPage />} />
<Route path="/beneficiary/dashboard" element={<BeneficiaryRoute><BeneficiaryDashboard /></BeneficiaryRoute>} />
<Route path="/beneficiary/submit" element={<BeneficiaryRoute><BeneficiarySubmitPage /></BeneficiaryRoute>} />
<Route path="/beneficiary/track" element={<TrackRequestPage />} />

<Route
  path="/beneficiary/bonds"
  element={<BeneficiaryBondsPage />}
/>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AssociationDashboard />
                </AdminRoute>
              }
            />
            
            <Route
              path="/admin/stores"
              element={
                <AdminRoute>
                  <StoresPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/beneficiaries"
              element={
                <AdminRoute>
                  <BeneficiariesPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/restaurants"
              element={
                <AdminRoute>
                  <DashboardLayout title="Restaurant Requests">
                    <RestaurantRequestsPage />
                  </DashboardLayout>
                </AdminRoute>
              }
            />
            <Route path="/admin/restaurants/donations" element={<RestaurantDonationsAdmin />} />

            <Route
              path="/admin/vouchers"
              element={
                <DashboardLayout title="Vouchers">
                  <VouchersAdmin />
                </DashboardLayout>
              }
            />
            <Route
              path="/admin/gift-donations"
              element={
                <AdminRoute>
                  <GiftDonationsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/shelters"
              element={
                <AdminRoute>
                  <SheltersPage />
                </AdminRoute>
              }
            />
<Route
  path="/admin/challenges"
  element={
    <AdminRoute>
      <AdminChallengesPage />
    </AdminRoute>
  }
/>

<Route
  path="/admin/challenges/create"
  element={
    <AdminRoute>
      <CreateChallengePage />
    </AdminRoute>
  }
/>

<Route
  path="/admin/challenges/edit/:id"
  element={
    <AdminRoute>
      <EditChallengePage />
    </AdminRoute>
  }
/>



<Route path="/admin/seasons" element={<SeasonManagementPage />} />
<Route path="/admin/seasons/:id/items" element={<SeasonItemsPage />} />
<Route
  path="/admin/food-bonds"
  element={
    <AdminRoute>
      <FoodBondsPage />
    </AdminRoute>
  }
/>
<Route
  path="/admin/food-bonds/:id"
  element={
    <AdminRoute>
      <FoodBondDetailsPage />
    </AdminRoute>
  }
/>

<Route
  path="/admin/money-donations"
  element={<MoneyDonationsPage />}
/>

            {/* Restaurant Routes */}
<Route path="/restaurant/login" element={<RestaurantLogin />} />
<Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
<Route
  path="/restaurant/donations/add"
  element={
    <RestaurantRoute>
      <RestaurantLayout>
        <AddDonationPage />
      </RestaurantLayout>
    </RestaurantRoute>
  }
/>

  <Route path="/restaurant/join-request" element={<SendJoinRequestPage />} />

<Route
  path="/restaurant/posts"
  element={
      <RestaurantLayout>
        <PostsPage />
      </RestaurantLayout>
  }
/>
<Route
  path="/restaurant/scan-bond"
  element={<FoodBondScanAndConfirm />}
/>



            {/* Shelter Routes */}
            <Route path="/shelter/login" element={<ShelterLogin />} />
    
<Route path="/shelter/login" element={<ShelterLogin />} />

<Route
  path="/shelter/dashboard/*"
  element={
    <ShelterRoute>
      <ShelterDashboard />
    </ShelterRoute>
  }
/>



            {/* Store Routes */}
            <Route path="/store/login" element={<StoreLogin />} />
<Route path="/store/scan-voucher" element={<VoucherScanAndRedeem />} />

            <Route path="/store" element={<StoreDashboard />} />
            <Route
              path="/store/dashboard"
              element={
                <StoreRoute>
                  <FoodStoreLayout />
                </StoreRoute>
              }
            />

            {/* Not Found */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
