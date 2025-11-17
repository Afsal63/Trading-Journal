"use client";

import { useEffect, useState } from "react";

interface EditModalProps {
  entry: any | null;
  onSave: (updated: any) => void;
  onClose: () => void;
}

export default function EditModal({ entry, onSave, onClose }: EditModalProps) {
  // Local editable state (independent of entry at initialization)
  const [updatedEntry, setUpdatedEntry] = useState<any>({
    id: undefined,
    dbId: undefined,
    date: "",
    pnl: "",
    notes: "",
    photo: "",
    tradeResult: "",
  });

  // Format date → "yyyy-mm-dd"
  const formatDate = (value: any) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  // Sync local state whenever a new entry is passed in
  useEffect(() => {
    if (!entry) return;

    setUpdatedEntry({
      ...entry,
      date: formatDate(entry.date),
      pnl:
        entry.pnl !== undefined && entry.pnl !== null
          ? String(entry.pnl)
          : "",
      notes: entry.notes ?? "",
      photo: entry.photo ?? "",
      tradeResult: entry.tradeResult || "",
    });
  }, [entry]);

  // After hooks: if no entry, render nothing
  if (!entry) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUpdatedEntry((prev: any) => ({
        ...prev,
        photo: event.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const pnlNumber =
      updatedEntry.pnl === "" || updatedEntry.pnl === null
        ? 0
        : Number(updatedEntry.pnl);

    const finalEntry = {
      ...updatedEntry,
      pnl: pnlNumber,
    };

    onSave(finalEntry);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 w-96 border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">
          ✏️ Edit Trade
        </h2>

        {/* 📅 Trade Date */}
        <label className="text-gray-400 text-sm mb-1 block">Trade Date</label>
        <input
          type="date"
          value={updatedEntry.date}
          onChange={(e) =>
            setUpdatedEntry({ ...updatedEntry, date: e.target.value })
          }
          className="bg-black border border-gray-700 text-white rounded-lg px-3 py-2 w-full mb-4"
        />

        {/* 🎯 Trade Outcome */}
        <label className="text-gray-400 text-sm mb-1 block">
          Trade Outcome
        </label>
        <select
          value={updatedEntry.tradeResult || ""}
          onChange={(e) =>
            setUpdatedEntry({ ...updatedEntry, tradeResult: e.target.value })
          }
          className="bg-black border border-gray-700 text-white rounded-lg px-3 py-2 w-full mb-4"
        >
          <option value="">Select result</option>
          <option value="tp_hit">TP Hit</option>
          <option value="sl_hit">SL Hit</option>
          <option value="partial">Partial</option>
          <option value="breakeven">Break-even</option>
          <option value="missed">Missed</option>
          <option value="manual_exit">Manual Exit</option>
        </select>

        {/* 💰 PnL */}
        <label className="text-gray-400 text-sm mb-1 block">PnL (₹)</label>
        <input
          type="number"
          value={updatedEntry.pnl}
          onChange={(e) =>
            setUpdatedEntry({
              ...updatedEntry,
              pnl: e.target.value, // keep as string in state
            })
          }
          className="bg-black border border-gray-700 text-white rounded-lg px-3 py-2 w-full mb-4"
        />

        {/* 📝 Notes */}
        <label className="text-gray-400 text-sm mb-1 block">Notes</label>
        <textarea
          value={updatedEntry.notes}
          onChange={(e) =>
            setUpdatedEntry({ ...updatedEntry, notes: e.target.value })
          }
          className="bg-black border border-gray-700 text-white rounded-lg px-3 py-2 w-full h-20 mb-4"
        />

        {/* 🖼️ Image */}
        {updatedEntry.photo && (
          <img
            src={updatedEntry.photo}
            alt="journal"
            className="w-full h-36 object-cover rounded-lg mb-2 border border-gray-700"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="text-gray-400 text-sm mb-4"
        />

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
