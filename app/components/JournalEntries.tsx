"use client";

import { useState } from "react";

interface JournalEntriesProps {
  entries: any[];
  onEdit: (entry: any) => void;
  onDelete: (id: number) => void;
  selectedMonth: number;
  selectedYear: number;
}

export default function JournalEntries({
  entries,
  onEdit,
  onDelete,
  selectedMonth,
  selectedYear,
}: JournalEntriesProps) {
  const [filterResult, setFilterResult] = useState<string>("all");

  // Month/Year + TradeResult Filtering
  const filteredEntries = entries?.filter((entry) => {
    const date = new Date(entry.date);
    const dateMatch =
      date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;

    const filterMatch =
      filterResult === "all" || entry.tradeResult === filterResult;

    return dateMatch && filterMatch;
  });

  const confirmDelete = (id: number) => {
    const ok = window.confirm("Are you sure you want to delete this entry?");
    if (ok) onDelete(id);
  };

  const badgeStyles: Record<string, string> = {
    tp_hit: "bg-green-700",
    sl_hit: "bg-red-700",
    partial: "bg-yellow-600",
    breakeven: "bg-blue-600",
    missed: "bg-gray-600",
    manual_exit: "bg-purple-600",
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <h2 className="text-xl font-semibold">
          📜 Trade Journal —{" "}
          {new Date(selectedYear, selectedMonth).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        {/* Filter Dropdown */}
        <select
          value={filterResult}
          onChange={(e) => setFilterResult(e.target.value)}
          className="bg-black border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All Results</option>
          <option value="tp_hit">TP Hit</option>
          <option value="sl_hit">SL Hit</option>
          <option value="partial">Partial</option>
          <option value="breakeven">Breakeven</option>
          <option value="missed">Missed</option>
          <option value="manual_exit">Manual Exit</option>
        </select>
      </div>

      {filteredEntries.length === 0 ? (
        <p className="text-gray-500">No entries found for selected filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-gray-800 rounded-2xl overflow-hidden shadow-md border border-gray-700 hover:border-green-400 transition-all duration-200 hover:scale-[1.02]"
            >
              {/* Image */}
              {entry.photo && (
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={entry.photo}
                    alt="journal"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Info */}
              <div className="p-4 space-y-2">
                <p className="text-sm text-gray-400">{entry.date}</p>

                {/* Result Badge */}
                {entry.tradeResult && (
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-semibold inline-block ${
                      badgeStyles[entry.tradeResult]
                    }`}
                  >
                    {entry.tradeResult.replace("_", " ").toUpperCase()}
                  </span>
                )}

                {/* PnL */}
                <p
                  className={`text-2xl font-bold ${
                    entry.pnl > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  ₹{entry?.pnl?.toLocaleString()}
                </p>

                {/* Notes */}
                {entry.notes && (
                  <p className="text-gray-300 text-sm line-clamp-2">
                    {entry.notes}
                  </p>
                )}

                {/* Actions */}
                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => onEdit(entry)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(entry.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
