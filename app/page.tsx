"use client";

import { useState } from "react";
import AddEntryForm from "./components/AddEntryForm";
import JournalEntries from "./components/JournalEntries";
import EditModal from "./components/EditModal";
import CapitalOverview from "./components/CapitalOverview";
import PnLCalendar from "./components/PnLCalendar";
import StatsSummary from "./components/StatsSummary";

export default function HomePage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [editEntry, setEditEntry] = useState<any | null>(null);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [initialCapital, setInitialCapital] = useState(100000);

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

  // ─── Handlers ────────────────────────────────────────────────
  const handleAdd = (entry: any) => setEntries([...entries, entry]);
  const handleDelete = (id: number) =>
    setEntries(entries.filter((e) => e.id !== id));
  const handleSaveEdit = (updated: any) => {
    setEntries(entries.map((e) => (e.id === updated.id ? updated : e)));
    setEditEntry(null);
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
        entries={filteredEntries}
        initialCapital={initialCapital}
        setInitialCapital={setInitialCapital}
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