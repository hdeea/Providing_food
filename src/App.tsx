import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ReactNode } from "react";

// Main Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin Pages
import RestaurantsPage from "./pages/Admin/RestaurantsPage";
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
// Restaurant Pages
import DashboardPage from "./pages/Restaurant/DashboardPage";
import RestaurantLogin from "./pages/Auth/RestaurantLogin";

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

// Layouts
import DashboardLayout from "./components/Layout/DashboardLayout";

// Auth Components
import { Register } from "./components/Auth/Register";

//Gift Bond
const queryClient = new QueryClient();
import ShelterIndex from "./pages/Shelter/Index";
import ShelterDashboard from "./components/Shelters/ShelterDashboard";

// Protected Route
const ProtectedRoute = ({
  children,
  allowedRoles = [],
}: {
  children: ReactNode;
  allowedRoles?: string[];
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    const fallbackLogin = allowedRoles.includes("admin")
      ? "/login"
      : allowedRoles.includes("restaurant")
      ? "/restaurant/login"
      : allowedRoles.includes("beneficiary")
      ? "/beneficiary/login"
      : allowedRoles.some((role) => role.includes("shelter"))
      ? "/shelter/login"
      : allowedRoles.some((role) => role.includes("store"))
      ? "/store/login"
      : "/login";

    return <Navigate to={fallbackLogin} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Donor (Individual) */}
            <Route path="/individual/donate" element={<DonorRegistrationPage />} />
            <Route path="/individual/track-donations" element={<TrackDonationsPage />} />

            {/* Beneficiary Routes */}
    <Route path="/beneficiary/register" element={<BeneficiaryRegisterPage />} />
<Route path="/beneficiary/login" element={<BeneficiaryLoginPage />} />
<Route path="/beneficiary/dashboard" element={<BeneficiaryRoute><BeneficiaryDashboard /></BeneficiaryRoute>} />
<Route path="/beneficiary/submit" element={<BeneficiaryRoute><BeneficiarySubmitPage /></BeneficiaryRoute>} />
<Route path="/beneficiary/track" element={<BeneficiaryRoute><TrackRequestPage /></BeneficiaryRoute>} />

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
              path="/admin/restaurants"
              element={
                <AdminRoute>
                  <RestaurantsPage />
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

            {/* Restaurant Routes */}
            <Route path="/restaurant/login" element={<RestaurantLogin />} />
            <Route
              path="/restaurant/dashboard"
              element={
                <RestaurantRoute>
                  <FoodStoreLayout />
                </RestaurantRoute>
              }
            />
<Route path="/admin/pending" element={<AdminPendingRequestsPage />} />

            {/* Shelter Routes */}
            <Route path="/shelter/login" element={<ShelterLogin />} />
    
{/* Shelter Routes */}
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
            <Route path="/store/scan" element={<ScanVoucher />} />
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
