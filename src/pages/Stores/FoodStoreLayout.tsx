import { useState } from "react";
import { Sidebar } from "../../components/Stores/sidebar";
import { Dashboard } from "../../components/Stores/Dashboard";
import { VouchersManagement } from "../../components/Stores/VouchersManagemant";
import { StoreInformation } from "../../components/Stores/StoreInformation";
import { MyRequests } from "../../components/Stores/MyRequests";

export default function FoodStoreLayout() {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-beige-50 to-white">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {activeSection === "home" && <Dashboard />}
          {activeSection === "vouchers" && <VouchersManagement />}
          {activeSection === "settings" && <StoreInformation />}
        {activeSection === "baskets" && <MyRequests />}


        </div>
      </main>
    </div>
  );
}
