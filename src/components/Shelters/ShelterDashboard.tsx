import { useEffect, useState } from "react";
import { getMyShelter } from "@/api/Shelter/getMyShelter";
import { getMyShelterPosts } from "@/api/Shelter/getMyPosts";

import Sidebar from "./ShelterSidebar";
import ShelterContent from "./ShelterContent";
import ShelterHeader from "./ShelterHeader";

import Overview from "./sections/Overview";
import Posts from "./sections/Posts";
import CreatePost from "./sections/CreatePost";
import Donations from "./sections/Donations";
import RequestStatus from "./sections/RequestStatus";

import { Routes, Route } from "react-router-dom";

export default function ShelterDashboard() {
  const [shelter, setShelter] = useState(null);
  const [posts, setPosts] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const s = await getMyShelter();
      const p = await getMyShelterPosts();

      setShelter(s);
      setPosts(p || []);
    } catch (err) {
      console.log("Error loading dashboard:", err);
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      <ShelterHeader />

      <div className="flex">
        <Sidebar shelter={shelter} />

        <div className="flex-1 p-6">
          {/* ShelterContent يقرر إذا مسموح يدخل */}
          <ShelterContent shelter={shelter} />

          {/* إذا Approved → نعرض الصفحات */}
          {shelter?.status === "Approved" && (
            <Routes>
              <Route
                path="/"
                element={
                  <Overview
                    postsCount={posts.length}
                    donationsCount={donations.length}
                    shelter={shelter}
                  />
                }
              />

              <Route
                path="overview"
                element={
                  <Overview
                    postsCount={posts.length}
                    donationsCount={donations.length}
                    shelter={shelter}
                  />
                }
              />

              <Route path="posts" element={<Posts posts={posts} />} />

              <Route path="create-post" element={<CreatePost />} />

              <Route
                path="donations"
                element={<Donations donations={donations} />}
              />

              <Route
                path="request-status"
                element={<RequestStatus shelter={shelter} />}
              />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
}
