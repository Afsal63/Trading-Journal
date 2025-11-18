"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useState, useEffect } from "react";

interface CapitalOverviewProps {
  entries: any[];
  initialCapital: number;
  setInitialCapital: (val: number) => void;
  selectedMonth: number;
  selectedYear: number;
}

export default function CapitalOverview({
  entries,
  initialCapital,
  setInitialCapital,
  selectedMonth,
  selectedYear,
}: CapitalOverviewProps) {
  const [viewMode, setViewMode] = useState<"month" | "year">("month");

  const [isEditing, setIsEditing] = useState(false);
  const [tempCapital, setTempCapital] = useState(initialCapital);

  // Keep tempCapital in sync with backend value
  useEffect(() => {
    setTempCapital(initialCapital);
  }, [initialCapital]);

  // Filter entries
  const filteredEntries =
    viewMode === "month"
      ? entries.filter((e) => {
          const d = new Date(e.date);
          return (
            d.getMonth() === selectedMonth && d.getFullYear() === selectedYear
          );
        })
      : entries.filter((e) => {
          const d = new Date(e.date);
          return d.getFullYear() === selectedYear;
        });

  // Helper to read PnL
  const getPnL = (e: any) => e.pnl ?? e.profitLoss ?? 0;

  // Calculations based on filtered trades
  const totalPnl = filteredEntries.reduce(
    (acc, e) => acc + getPnL(e),
    0
  );

  const currentCapital = initialCapital + totalPnl;
  const growth = currentCapital - initialCapital;
  const growthPercent = initialCapital
    ? ((growth / initialCapital) * 100).toFixed(2)
    : "0.00";

  const data = [
    { name: "Initial", value: initialCapital },
    { name: growth >= 0 ? "Profit" : "Loss", value: Math.abs(growth) },
  ];

  // Save edited capital (calls handler from HomePage → updates backend)
  const handleSave = () => {
    setInitialCapital(tempCapital);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempCapital(initialCapital);
    setIsEditing(false);
  };

  return (
    <div className="bg-[#0B0B0D] p-6 rounded-2xl mb-8 border border-[#1A1A1D] shadow-xl">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            💹 Capital Overview
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {viewMode === "month"
              ? new Date(selectedYear, selectedMonth).toLocaleString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              : `Year: ${selectedYear}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle */}
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as "month" | "year")}
            className="bg-[#111] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-green-500"
          >
            <option value="month">📅 Monthly</option>
            <option value="year">🗓️ Yearly</option>
          </select>

          {/* Edit Capital */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm"
            >
              Edit Capital
            </button>
          ) : (
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={tempCapital}
                onChange={(e) =>
                  setTempCapital(parseFloat(e.target.value) || 0)
                }
                className="bg-black border border-gray-700 rounded-xl px-3 py-2 w-28 text-sm text-white focus:ring-1 focus:ring-green-500"
              />
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl text-sm"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded-xl text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BODY */}
      {filteredEntries.length === 0 ? (
        <p className="text-gray-500 text-center py-10 text-sm">
          No trades found for this {viewMode}.
        </p>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* PIE CHART */}
          <div className="w-full md:w-1/2 h-60">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={70}
                  label={({ name, percent }) =>
                    `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`
                  }
                >
                  <Cell fill="#4ADE80" />
                  <Cell fill={growth >= 0 ? "#4ADE80" : "#F87171"} />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    border: "1px solid #333",
                    color: "#fff",
                  }}
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString()}`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* DETAILS */}
          <div className="md:w-1/2 space-y-3 text-center md:text-left">
            <div className="bg-[#111] p-4 rounded-xl border border-[#222]">
              <p className="text-gray-400 text-sm">Initial Capital</p>
              <h3 className="text-lg text-white font-bold">
                ${initialCapital.toLocaleString("en-IN")}
              </h3>
            </div>

            <div
              className={`p-4 rounded-xl border ${
                growth >= 0
                  ? "bg-[#052E16] border-green-800"
                  : "bg-[#2C0A0A] border-red-800"
              }`}
            >
              <p className="text-gray-400 text-sm">Current Capital</p>
              <h3
                className={`text-lg font-bold ${
                  growth >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                ${currentCapital.toLocaleString("en-IN")}{" "}
                <span className="text-sm text-gray-400">
                  ({growth >= 0 ? "+" : ""}
                  {growthPercent}%)
                </span>
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
