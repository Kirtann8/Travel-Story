import React from "react";
import { MdTravelExplore, MdLocationOn, MdFavorite, MdPhotoCamera } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import { useCache } from "../../hooks/useCache";
import { analyticsCache } from "../../utils/cache";

const TravelStats = () => {
  const { data: stats, loading, refetch } = useCache(
    'travel-stats',
    async () => {
      const response = await axiosInstance.get("/analytics/stats");
      return response.data;
    }
  );

  // Listen for story updates
  React.useEffect(() => {
    const handleStorageChange = () => {
      analyticsCache.clear();
      refetch();
    };
    
    window.addEventListener('travelStoryUpdated', handleStorageChange);
    return () => window.removeEventListener('travelStoryUpdated', handleStorageChange);
  }, [refetch]);

  if (loading) return <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>;
  if (!stats) return null;

  const statCards = [
    {
      title: "Total Trips",
      value: stats.totalTrips,
      icon: MdTravelExplore,
      color: "bg-blue-500"
    },
    {
      title: "Countries Visited",
      value: stats.totalCountries,
      icon: MdLocationOn,
      color: "bg-green-500"
    },
    {
      title: "Favorite Destinations",
      value: stats.favoriteDestinations.length,
      icon: MdFavorite,
      color: "bg-red-500"
    },
    {
      title: "Avg Trip Duration",
      value: `${stats.avgTripDuration} days`,
      icon: MdPhotoCamera,
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
            <div className={`${card.color} p-3 rounded-full`}>
              <card.icon className="text-white text-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TravelStats;