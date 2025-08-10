import React, { useState, useEffect } from "react";
import { MdAttachMoney, MdTrendingUp } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const SpendingTracker = () => {
  const [spendingData, setSpendingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpendingData();
  }, []);

  const fetchSpendingData = async () => {
    try {
      const response = await axiosInstance.get("/analytics/spending");
      setSpendingData(response.data);
    } catch (error) {
      console.error("Failed to fetch spending data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>;
  if (!spendingData) return null;

  const categoryTotals = spendingData.spendingData.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const categoryColors = {
    Accommodation: "bg-blue-500",
    Food: "bg-green-500", 
    Transport: "bg-yellow-500",
    Activities: "bg-purple-500"
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Travel Spending</h3>
        <MdAttachMoney className="text-green-500 text-xl" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">${spendingData.totalSpending.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Total Spent</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">${spendingData.avgPerTrip.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Avg per Trip</p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Spending by Category</h4>
        {Object.entries(categoryTotals).map(([category, amount]) => (
          <div key={category} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded ${categoryColors[category]}`}></div>
              <span className="text-sm text-gray-700">{category}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">${amount.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <MdTrendingUp />
          <span>Track your travel budget efficiently</span>
        </div>
      </div>
    </div>
  );
};

export default SpendingTracker;