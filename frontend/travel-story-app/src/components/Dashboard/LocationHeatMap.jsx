import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

const LocationHeatMap = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/analytics/stats");
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch location data:", error);
    }
  };

  if (!data) return <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>;

  const getIntensityColor = (count, max) => {
    const intensity = count / max;
    if (intensity > 0.8) return "bg-red-600";
    if (intensity > 0.6) return "bg-red-500";
    if (intensity > 0.4) return "bg-orange-500";
    if (intensity > 0.2) return "bg-yellow-500";
    return "bg-green-400";
  };

  const maxCount = Math.max(...data.favoriteDestinations.map(d => d.count), 1);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Visited Locations Heat Map</h3>
      
      <div className="space-y-3">
        {data.favoriteDestinations.map((destination, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div 
              className={`w-4 h-4 rounded ${getIntensityColor(destination.count, maxCount)}`}
              title={`Visited ${destination.count} times`}
            ></div>
            <div className="flex-1 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{destination.location}</span>
              <span className="text-xs text-gray-500">{destination.count} visits</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Less visited</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <div className="w-3 h-3 bg-red-600 rounded"></div>
          </div>
          <span>More visited</span>
        </div>
      </div>
    </div>
  );
};

export default LocationHeatMap;