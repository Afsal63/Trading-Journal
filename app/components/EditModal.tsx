"use client";

import { useState } from "react";

interface EditModalProps {
  entry: any | null;
  onSave: (updated: any) => void;
  onClose: () => void;
}

export default function EditModal({ entry, onSave, onClose }: EditModalProps) {
  if (!entry) return null;

  const [updatedEntry, setUpdatedEntry] = useState({ ...entry });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUpdatedEntry((prev:any) => ({
        ...prev,
        photo: event.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave(updatedEntry);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 w-96 border border-gray-700">
        <h2 className="text-lg font-semibold mb-4">✏️ Edit Entry</h2>

        {/* Date */}
        <input
          type="date"
          value={updatedEntry.date}
          onChange={(e) =>
            setUpdatedEntry({ ...updatedEntry, date: e.target.value })
          }
          className="bg-black border border-gray-700 text-white rounded-lg px-3 py-2 w-full mb-3"
        />

        {/* PnL */}
        <input
          type="number"
          value={updatedEntry.pnl}
          onChange={(e) =>
            setUpdatedEntry({
              ...updatedEntry,
              pnl: parseFloat(e.target.value),
            })
          }
          className="bg-black border border-gray-700 text-white rounded-lg px-3 py-2 w-full mb-3"
        />

        {/* Notes */}
        <textarea
          value={updatedEntry.notes}
          onChange={(e) =>
            setUpdatedEntry({ ...updatedEntry, notes: e.target.value })
          }
          className="bg-black border border-gray-700 text-white rounded-lg px-3 py-2 w-full h-20 mb-3"
        />

        {/* Image Upload + Preview */}
        <div className="mb-4">
          {updatedEntry.photo && (
            <img
              src={updatedEntry.photo}
              alt="journal"
              className="w-full h-40 object-cover rounded-lg mb-2 border border-gray-700"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="text-gray-400 text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}