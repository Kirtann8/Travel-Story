import React from "react";
import Navbar from "../../components/Navbar";
import TravelStats from "../../components/Dashboard/TravelStats";
import ActivityChart from "../../components/Dashboard/ActivityChart";
import LocationHeatMap from "../../components/Dashboard/LocationHeatMap";
import SpendingTracker from "../../components/Dashboard/SpendingTracker";
import EnhancedSpendingChart from "../../components/Dashboard/EnhancedSpendingChart";
import TripAnalytics from "../../components/Dashboard/TripAnalytics";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6 lg:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Dashboard</h1>
          <p className="text-gray-600">Your travel statistics and insights at a glance</p>
        </div>

        {/* Travel Statistics Cards */}
        <TravelStats />

        {/* Charts and Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ActivityChart />
          <LocationHeatMap />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SpendingTracker />
          <EnhancedSpendingChart />
        </div>

        <TripAnalytics />
      </div>
    </>
  );
};

export default Dashboard;