import { useEffect, useState } from "react";
import { getMyShelter } from "@/api/Shelter/getMyShelter";
import Sidebar from "./ShelterSidebar";
import ShelterContent from "./ShelterContent";
import { Routes, Route } from "react-router-dom";

export default function ShelterDashboard() {
  const [shelter, setShelter] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await getMyShelter();
      console.log("MY SHELTER:", data);
      setShelter(data);
    } catch (err) {
      console.log("No shelter found");
      setShelter(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div className="flex">
      <Sidebar shelter={shelter} />

      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<ShelterContent shelter={shelter} />} />
          <Route path="overview" element={<ShelterContent shelter={shelter} />} />
          <Route path="posts" element={<ShelterContent shelter={shelter} />} />
          <Route path="create-post" element={<ShelterContent shelter={shelter} />} />
          <Route path="donations" element={<ShelterContent shelter={shelter} />} />
          <Route path="request-status" element={<ShelterContent shelter={shelter} />} />
          <Route path="register" element={<ShelterContent shelter={shelter} />} />
        </Routes>
      </div>
    </div>
  );
}
