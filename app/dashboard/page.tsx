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
  const [initialCapital, setInitialCapital] = useState(100000);

  // ─── Load trades + initial capital from backend on mount ─────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tradesData, capitalData] = await Promise.all([
          get("/trades"),          // GET /api/trades
          get("/capital/initial"), // GET /api/capital/initial
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

  // ─── Filter entries based on month/year ──────────────────────
  const filteredEntries = entries.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  // ─── Safe helper for accessing profit/loss value ─────────────
  const getPnL = (e: any) => e.profitLoss ?? e.pnl ?? 0;

  // ─── Stats Calculation ───────────────────────────────────────
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
      ? (
          (filteredEntries.filter((e) => getPnL(e) > 0).length / totalTrades) *
          100
        ).toFixed(1)
      : 0;

  // helper for numeric UI id
  const getNextId = () =>
    entries.length === 0 ? 1 : Math.max(...entries.map((e) => e.id ?? 0)) + 1;

  // ─── Handlers ────────────────────────────────────────────────

  // Add: POST /api/trades, then update state
  const handleAdd = (entry: any) => {
    (async () => {
      try {
        const saved = await post("/trades", entry); // POST /api/trades
        const newEntry = {
          ...entry,
          id: getNextId(),
          dbId: saved._id,
        };
        setEntries((prev) => [...prev, newEntry]);
      } catch (err) {
        console.error("Error adding trade:", err);
      }
    })();
  };

  // Delete: use numeric id for UI, dbId for backend
  const handleDelete = (id: number) => {
    (async () => {
      const entry = entries.find((e) => e.id === id);
      if (!entry) return;

      try {
        await del(`/trades/${entry.dbId}`); // DELETE /api/trades/:id
        setEntries((prev) => prev.filter((e) => e.id !== id));
      } catch (err) {
        console.error("Error deleting trade:", err);
      }
    })();
  };

  // Edit: PUT /api/trades/:id, then update state
  const handleSaveEdit = (updated: any) => {
    (async () => {
      const existing = entries.find((e) => e.id === updated.id);
      if (!existing) {
        setEditEntry(null);
        return;
      }

      try {
        const saved = await put(`/trades/${existing.dbId}`, updated); // PUT /api/trades/:id

        const updatedWithDb = {
          ...updated,
          dbId: existing.dbId,
          _id: saved._id ?? existing.dbId,
        };

        setEntries((prev) =>
          prev.map((e) => (e.id === updated.id ? updatedWithDb : e))
        );
        setEditEntry(null);
      } catch (err) {
        console.error("Error updating trade:", err);
      }
    })();
  };

  // Capital change handler (called only when you click Save in CapitalOverview)
  const handleInitialCapitalChange = (val: number) => {
    setInitialCapital(val);

    (async () => {
      try {
        await put("/capital/initial", { initialCapital: val });
      } catch (err) {
        console.error("Error updating initial capital:", err);
      }
    })();
  };

  // ─── Render ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        💼 Trading Journal Dashboard
      </h1>

      {/* Stats Summary */}
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

      {/* Capital Overview */}
      <CapitalOverview
        entries={entries} // full list so monthly/yearly toggle works
        initialCapital={initialCapital}
        setInitialCapital={handleInitialCapitalChange} // ⬅️ saves when you click Save
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />

      {/* Other Components */}
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
