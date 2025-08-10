import React, { useState, useEffect } from "react";
import { MdAccessTime, MdPhotoCamera } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const TripAnalytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/analytics/stats");
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  if (!data) return <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Trip Duration Analytics */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <MdAccessTime className="text-blue-500 text-xl" />
          <h3 className="text-lg font-semibold text-gray-900">Trip Duration</h3>
        </div>
        
        <div className="text-center mb-4">
          <p className="text-3xl font-bold text-blue-600">{data.avgTripDuration}</p>
          <p className="text-sm text-gray-600">Average Days per Trip</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Short trips (1-3 days)</span>
            <span className="font-medium">25%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Medium trips (4-7 days)</span>
            <span className="font-medium">45%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Long trips (8+ days)</span>
            <span className="font-medium">30%</span>
          </div>
        </div>
      </div>

      {/* Most Photographed Locations */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <MdPhotoCamera className="text-purple-500 text-xl" />
          <h3 className="text-lg font-semibold text-gray-900">Most Photographed</h3>
        </div>

        <div className="space-y-3">
          {data.photographedLocations.map((location, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">#{index + 1}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{location.location}</span>
              </div>
              <span className="text-xs text-gray-500">{location.count} photos</span>
            </div>
          ))}
        </div>

        {data.photographedLocations.length === 0 && (
          <p className="text-center text-gray-500 text-sm">No photo data available</p>
        )}
      </div>
    </div>
  );
};

export default TripAnalytics;