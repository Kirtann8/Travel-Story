import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { MdAttachMoney } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import { useCache } from "../../hooks/useCache";

const EnhancedSpendingChart = () => {
  const { data: spendingData, loading } = useCache(
    'spending-data',
    async () => {
      const response = await axiosInstance.get("/analytics/spending");
      return response.data;
    }
  );

  if (loading) return <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>;
  if (!spendingData) return null;

  const categoryTotals = spendingData.spendingData.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const pieData = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Spending Breakdown</h3>
        <MdAttachMoney className="text-green-500 text-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">${spendingData.totalSpending.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Spent</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">${spendingData.avgPerTrip.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Avg per Trip</p>
          </div>
          
          <div className="space-y-2">
            {Object.entries(categoryTotals).map(([category, amount], index) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm text-gray-700">{category}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">${amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSpendingChart;