"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface AddEntryFormProps {
  onAdd: (entry: any) => void;
}

export default function AddEntryForm({ onAdd }: AddEntryFormProps) {
  const [form, setForm] = useState({
    date: new Date(),
    pnl: "",
    notes: "",
    photo: "",
    tradeResult: "", // TP/SL status
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setForm((prev) => ({ ...prev, photo: event.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.pnl) return alert("Please fill required fields");

    onAdd({
      id: Date.now(),
      ...form,
      date: form.date.toISOString().split("T")[0],
      pnl: parseFloat(form.pnl),
    });

    setForm({
      date: new Date(),
      pnl: "",
      notes: "",
      photo: "",
      tradeResult: "",
    });
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-8">
      <h2 className="text-xl font-semibold mb-4">➕ Add Trade Journal</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* 📅 Date */}
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Trade Date</label>
          <DatePicker
            selected={form.date}
            onChange={(date: Date | null) => date && setForm({ ...form, date })}
            dateFormat="yyyy-MM-dd"
            className="bg-black border border-gray-700 text-white rounded-lg px-3 py-2 w-full"
            maxDate={new Date()}
          />
        </div>

        {/* 🎯 TP/SL Result */}
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Trade Outcome</label>
          <select
            value={form.tradeResult}
            onChange={(e) => setForm({ ...form, tradeResult: e.target.value })}
            className="bg-black border border-gray-700 text-white rounded-lg px-3 py-2 w-full"
            required
          >
            <option value="">Select result</option>
            <option value="tp_hit">TP Hit</option>
            <option value="sl_hit">SL Hit</option>
            <option value="partial">Partial</option>
            <option value="breakeven">Break-even</option>
            <option value="missed">Missed</option>
            <option value="manual_exit">Manual Exit</option>
          </select>
        </div>

        {/* 💰 PnL */}
        <input
          type="number"
          placeholder="PnL (₹)"
          value={form.pnl}
          onChange={(e) => setForm({ ...form, pnl: e.target.value })}
          className="bg-black border border-gray-700 text-white rounded-lg px-3 py-2 w-full"
          required
        />

        {/* 📝 Notes */}
        <textarea
          placeholder="Notes..."
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="bg-black border border-gray-700 text-white rounded-lg px-3 py-2 w-full h-20"
        />

        {/* 🖼️ Image */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="text-gray-400 text-sm"
        />

        {/* 💾 Submit */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full"
        >
          Add Entry
        </button>

      </form>
    </div>
  );
}
