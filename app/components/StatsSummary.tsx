"use client";

import React from "react";

export interface StatsSummaryProps {
  totalTrades: number;
  totalProfit: number;
  totalLoss: number;
  netPnL: number;
  winRate: string | number;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const StatsSummary: React.FC<StatsSummaryProps> = ({
  totalTrades,
  totalProfit,
  totalLoss,
  netPnL,
  winRate,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}) => {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-md mb-8">
      {/* Month & Year Selector */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400">Select Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-black text-white border border-gray-700 px-3 py-1 rounded-lg"
          >
            {months.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-black text-white border border-gray-700 px-3 py-1 rounded-lg"
          >
            {Array.from({ length: 6 }, (_, i) => 2020 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <h2 className="text-lg font-semibold text-white">
          📊 {months[selectedMonth]} {selectedYear}
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-black p-4 rounded-xl text-center">
          <h3 className="text-sm text-gray-400">Total Trades</h3>
          <p className="text-2xl font-bold text-white">{totalTrades}</p>
        </div>

        <div className="bg-black p-4 rounded-xl text-center">
          <h3 className="text-sm text-gray-400">Total Profit</h3>
          <p className="text-2xl font-bold text-green-400">
            ${totalProfit.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-black p-4 rounded-xl text-center">
          <h3 className="text-sm text-gray-400">Total Loss</h3>
          <p className="text-2xl font-bold text-red-400">
            ${Math.abs(totalLoss).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-black p-4 rounded-xl text-center">
          <h3 className="text-sm text-gray-400">Net P&L / Win Rate</h3>
          <p
            className={`text-2xl font-bold ${
              netPnL >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            ${netPnL.toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-gray-400">{winRate}% Win Rate</p>
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;