import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Banner from "./components/Banner";
import Dashboard from "./components/Dashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";

export interface BannerData {
  id?: number;
  description: string;
  link: string;
  timer: number;
  isVisible: boolean;
}

const App: React.FC = () => {
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await axios.get<BannerData>(
          "https://tuf-backend-sbw4.onrender.com/banner"
        );
        setBannerData(response.data);
      } catch (error) {
        console.error("Failed to fetch banner data:", error);
        toast.error("Failed to load banner data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannerData();
  }, []);

  const handleBannerUpdate = async (updatedData: Partial<BannerData>) => {
    try {
      if (bannerData) {
        const response = await axios.post<BannerData>(
          "https://tuf-backend-sbw4.onrender.com/banner",
          { ...bannerData, ...updatedData }
        );
        setBannerData(response.data);
        toast.success("Banner updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update banner:", error);
      toast.error("Failed to update banner. Please try again.");
    }
  };

  const handleBannerTimerEnd = () => {
    // Update the banner visibility only if the banner data exists
    setBannerData((prev) => (prev ? { ...prev, isVisible: false } : null));
    if (bannerData) handleBannerUpdate({ isVisible: false });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        <ToastContainer position="top-right" autoClose={3000} />
        {bannerData && bannerData.isVisible && (
          <Banner
            description={bannerData.description}
            link={bannerData.link}
            timer={bannerData.timer}
            onTimerEnd={handleBannerTimerEnd}
          />
        )}
        <main className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">Welcome to Our Website</h1>
          <p className="mb-4">PS : Using free render version so the apis would be a bit slow and the server might take time to boot up</p>
          <Dashboard
            bannerData={bannerData}
            onUpdateBanner={handleBannerUpdate}
          />
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
