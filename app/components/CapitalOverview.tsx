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

  // 🔥 Always update tempCapital when backend capital changes
  useEffect(() => {
    setTempCapital(initialCapital);
  }, [initialCapital]);

  // Filter Data
  const filteredEntries =
    viewMode === "month"
      ? entries.filter((e) => {
          const d = new Date(e.date);
          return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
        })
      : entries.filter((e) => {
          const d = new Date(e.date);
          return d.getFullYear() === selectedYear;
        });

  // Calculations
  const totalPnl = filteredEntries.reduce(
    (acc, e) => acc + (e.profitLoss ?? e.pnl ?? 0),
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

  // Save
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
                value={tempCapital}   // <-- FIXED
                onChange={(e) => setTempCapital(parseFloat(e.target.value) || 0)}
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
        // Chart + Stats UI ... (unchanged)
        <>
          {/* ... keep your existing UI below */}
        </>
      )}
    </div>
  );
}
