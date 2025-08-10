import React from "react";
import { MdLocationOn, MdFavorite, MdTrendingUp, MdAttachMoney, MdRefresh } from "react-icons/md";
import { useRealTimeData } from "../../hooks/useRealTimeData";

const Dashboard = () => {
  const { data: stats, loading: statsLoading, refetch: refetchStats } = useRealTimeData("/analytics/stats");
  const { data: spending, loading: spendingLoading, refetch: refetchSpending } = useRealTimeData("/analytics/spending");
  
  const loading = statsLoading || spendingLoading;
  
  const handleRefresh = () => {
    refetchStats();
    refetchSpending();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Refresh */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Travel Dashboard</h1>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <MdRefresh className="text-lg" />
          <span>Refresh</span>
        </button>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<MdTrendingUp className="text-blue-500" />}
          title="Total Trips"
          value={stats?.totalTrips || 0}
          color="blue"
        />
        <StatCard
          icon={<MdLocationOn className="text-green-500" />}
          title="Countries Visited"
          value={stats?.totalCountries || 0}
          color="green"
        />
        <StatCard
          icon={<MdFavorite className="text-red-500" />}
          title="Favorite Places"
          value={stats?.favoriteDestinations?.length || 0}
          color="red"
        />
        <StatCard
          icon={<MdAttachMoney className="text-yellow-500" />}
          title="Total Spent"
          value={`$${spending?.totalSpending || 0}`}
          color="yellow"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trips */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Trips</h3>
          <div className="space-y-3">
            {(stats?.recentTrips || []).slice(0, 5).map((trip) => (
              <div key={trip._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <img
                  src={trip.imageUrl}
                  alt={trip.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{trip.title}</h4>
                  <p className="text-xs text-gray-500">
                    {trip.visitedLocation.join(", ")}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(trip.visitedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Destinations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Favorite Destinations</h3>
          <div className="space-y-3">
            {(stats?.favoriteDestinations || []).slice(0, 5).map((dest, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <span className="font-medium">{dest.location}</span>
                </div>
                <span className="text-sm text-gray-500">{dest.count} visits</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">${spending?.avgPerTrip || 0}</div>
            <div className="text-sm text-gray-500">Avg per Trip</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats?.totalCountries || 0}</div>
            <div className="text-sm text-gray-500">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats?.favoriteDestinations?.length || 0}</div>
            <div className="text-sm text-gray-500">Favorites</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats?.totalTrips || 0}</div>
            <div className="text-sm text-gray-500">Total Trips</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => {
  const colorClasses = {
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
    red: "border-red-200 bg-red-50",
    yellow: "border-yellow-200 bg-yellow-50"
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow border-l-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};

export default Dashboard;