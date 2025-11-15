"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useState } from "react";

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

  // Filter trades based on selected mode (month or year)
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

  // Calculate total PnL
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
    { name: "Initial Capital", value: initialCapital },
    { name: growth >= 0 ? "Profit" : "Loss", value: Math.abs(growth) },
  ];

  return (
    <div className="bg-gray-900 p-6 rounded-2xl mb-8 border border-gray-800">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h2 className="text-xl font-semibold text-white">
          💹 Capital Growth –{" "}
          {viewMode === "month"
            ? new Date(selectedYear, selectedMonth).toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })
            : selectedYear}
        </h2>

        <div className="flex items-center gap-4">
          {/* Mode Toggle */}
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as "month" | "year")}
            className="bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>

          {/* Capital Input */}
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm">Initial ₹</label>
            <input
              type="number"
              value={initialCapital}
              onChange={(e) =>
                setInitialCapital(parseFloat(e.target.value) || 0)
              }
              className="bg-black border border-gray-700 rounded-lg px-3 py-2 w-28 text-sm text-white"
              placeholder="Capital"
            />
          </div>
        </div>
      </div>

      {/* Body */}
      {filteredEntries.length === 0 ? (
        <p className="text-gray-500 text-center">
          No trades for this {viewMode === "month" ? "month" : "year"}.
        </p>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Pie Chart */}
          <div className="w-full md:w-1/2 h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  label={({ name, percent }) =>
                    `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`
                  }
                >
                  <Cell fill="#00FF88" />
                  <Cell fill={growth >= 0 ? "#00FF88" : "#FF5555"} />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "none",
                    color: "#fff",
                  }}
                  formatter={(value, name) => [
                    `₹${Number(value).toLocaleString()}`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Capital Details */}
          <div className="mt-6 md:mt-0 md:w-1/2 text-center md:text-left">
            <h3 className="text-lg text-gray-300 mb-2">
              Initial Capital:{" "}
              <span className="text-white font-semibold">
                ₹{initialCapital.toLocaleString("en-IN")}
              </span>
            </h3>
            <h3
              className={`text-lg font-semibold ${
                growth >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              Current Capital: ₹{currentCapital.toLocaleString("en-IN")}{" "}
              <span className="text-sm text-gray-400">
                ({growth >= 0 ? "+" : ""}
                {growthPercent}%)
              </span>
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}