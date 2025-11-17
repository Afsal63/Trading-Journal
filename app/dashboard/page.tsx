"use client";

import { useState, useEffect } from "react";
import AddEntryForm from "../components/AddEntryForm";
import JournalEntries from "../components/JournalEntries";
import EditModal from "../components/EditModal";
import CapitalOverview from "../components/CapitalOverview";
import PnLCalendar from "../components/PnLCalendar";
import StatsSummary from "../components/StatsSummary";
import { get, post, put, del } from "../lib/api";

export default function HomePage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [editEntry, setEditEntry] = useState<any | null>(null);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [initialCapital, setInitialCapital] = useState<number>(100000);

  // Load trades + capital
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tradesData, capitalData] = await Promise.all([
          get("/trades"),
          get("/capital/initial"),
        ]);

        const mapped = tradesData.map((t: any, index: number) => ({
          ...t,
          id: index + 1,
          dbId: t._id,
        }));
        setEntries(mapped);

        if (capitalData?.initialCapital !== undefined) {
          setInitialCapital(capitalData.initialCapital);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };

    fetchData();
  }, []);

  // Filter entries by month & year
  const filteredEntries = entries.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const getPnL = (e: any) => e.pnl ?? e.profitLoss ?? 0;

  // Stats
  const totalTrades = filteredEntries.length;
  const totalProfit = filteredEntries
    .filter((e) => getPnL(e) > 0)
    .reduce((acc, e) => acc + getPnL(e), 0);
  const totalLoss = filteredEntries
    .filter((e) => getPnL(e) < 0)
    .reduce((acc, e) => acc + getPnL(e), 0);
  const netPnL = totalProfit + totalLoss;
  const winRate =
    totalTrades > 0
      ? ((filteredEntries.filter((e) => getPnL(e) > 0).length / totalTrades) * 100).toFixed(1)
      : 0;

  const getNextId = () =>
    entries.length === 0 ? 1 : Math.max(...entries.map((e) => e.id ?? 0)) + 1;

  // Add entry
  const handleAdd = (entry: any) => {
    (async () => {
      try {
        const saved = await post("/trades", entry);
        setEntries((prev) => [
          ...prev,
          { ...entry, id: getNextId(), dbId: saved._id },
        ]);
      } catch (err) {
        console.error("Error adding trade:", err);
      }
    })();
  };

  // Delete entry
  const handleDelete = (id: number) => {
    (async () => {
      const entry = entries.find((e) => e.id === id);
      if (!entry) return;
      try {
        await del(`/trades/${entry.dbId}`);
        setEntries((prev) => prev.filter((e) => e.id !== id));
      } catch (err) {
        console.error("Error deleting trade:", err);
      }
    })();
  };

  // Update entry
  const handleSaveEdit = (updated: any) => {
    (async () => {
      const existing = entries.find((e) => e.id === updated.id);
      if (!existing) return setEditEntry(null);

      try {
        const saved = await put(`/trades/${existing.dbId}`, updated);
        setEntries((prev) =>
          prev.map((e) => (e.id === updated.id ? { ...updated, dbId: existing.dbId } : e))
        );
        setEditEntry(null);
      } catch (err) {
        console.error("Error updating trade:", err);
      }
    })();
  };

  // Update capital
  const handleInitialCapitalChange = (val: number) => {
    (async () => {
      try {
        const updated = await put("/capital/initial", { initialCapital: val });
        setInitialCapital(updated.initialCapital);
      } catch (err) {
        console.error("Error updating capital:", err);
      }
    })();
  };

  // 🚀 Logout (remove cookie + redirect)
  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* Logout Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold"
        >
          Logout
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">
        💼 Trading Journal Dashboard
      </h1>

      {/* Components */}
      <StatsSummary
        totalTrades={totalTrades}
        totalProfit={totalProfit}
        totalLoss={totalLoss}
        netPnL={netPnL}
        winRate={winRate}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />

      <CapitalOverview
        entries={entries}
        initialCapital={initialCapital}
        setInitialCapital={handleInitialCapitalChange}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />

      <AddEntryForm onAdd={handleAdd} />

      <PnLCalendar
        entries={filteredEntries}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />

      <JournalEntries
        entries={filteredEntries}
        onEdit={setEditEntry}
        onDelete={handleDelete}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />

      <EditModal
        entry={editEntry}
        onSave={handleSaveEdit}
        onClose={() => setEditEntry(null)}
      />
    </div>
  );
}
