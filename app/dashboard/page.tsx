"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AddEntryForm from "../components/AddEntryForm";
import JournalEntries from "../components/JournalEntries";
import EditModal from "../components/EditModal";
import CapitalOverview from "../components/CapitalOverview";
import PnLCalendar from "../components/PnLCalendar";
import StatsSummary from "../components/StatsSummary";
import { get, post, put, del, logout } from "../lib/api";

export default function HomePage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [editEntry, setEditEntry] = useState<any | null>(null);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [initialCapital, setInitialCapital] = useState<number>(100000);

  const router = useRouter();

  // ─── Load trades + capital on mount ──────────────────────────
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
      } catch (err: any) {
        console.error("Failed to load data:", err);

        // ⬅️ If not authenticated (cookie cleared), send to login
        if (err?.status === 401) {
          router.push("/login");
        }
      }
    };

    fetchData();
  }, [router]);

  // ─── Filter entries by month/year ────────────────────────────
  const filteredEntries = entries.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const getPnL = (e: any) => e.pnl ?? e.profitLoss ?? 0;

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

  // Next UI ID helper
  const getNextId = () =>
    entries.length === 0 ? 1 : Math.max(...entries.map((e) => e.id ?? 0)) + 1;

  // ─── CRUD Handlers ───────────────────────────────────────────

  const handleAdd = (entry: any) => {
    (async () => {
      try {
        const saved = await post("/trades", entry);
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

  const handleSaveEdit = (updated: any) => {
    (async () => {
      const existing = entries.find((e) => e.id === updated.id);
      if (!existing) {
        setEditEntry(null);
        return;
      }

      try {
        const saved = await put(`/trades/${existing.dbId}`, updated);
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

  // 🔐 Logout via backend (clears cookie on Render domain)
 // inside HomePage component

const handleLogout = async () => {
  try {
   await logout();
router.push("/login");  
  } catch (err) {
    console.error("Logout failed:", err);
  } finally {
    router.replace("/login");  // 🔥 replace() avoids back button restoring session
  }
};

  // ─── Render UI ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header Row with Logout */}
      <div className="flex items-center justify-around mb-8">
        <h1 className="text-3xl font-bold">💼 Trading Journal Dashboard</h1>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold"
        >
          Logout
        </button>
      </div>

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
