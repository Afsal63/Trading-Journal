"use client";

interface PnLCalendarProps {
  entries: any[];
  selectedMonth: number;
  setSelectedMonth: (val: number) => void;
  selectedYear: number;
  setSelectedYear: (val: number) => void;
}

export default function PnLCalendar({
  entries,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}: PnLCalendarProps) {
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  console.log(entries, "clndr");

  const filteredEntries = entries.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const dailyPnL: Record<string, number> = {};
  filteredEntries.forEach((e) => {
    const d = new Date(e.date);

    // Normalize date key to YYYY-MM-DD (same format as dateStr below)
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateKey = `${y}-${m}-${day}`;

    // Support both pnl and profitLoss
    const pnlValue = Number(e.pnl ?? e.profitLoss ?? 0);

    dailyPnL[dateKey] = (dailyPnL[dateKey] || 0) + pnlValue;
  });

  return (
    <div className="bg-gray-900 p-6 rounded-2xl mb-8 border border-gray-800">
      <h2 className="text-xl font-semibold mb-4">📅 Monthly PnL Calendar</h2>

      <div className="flex items-center gap-4 mb-6 justify-center">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="bg-black border border-gray-700 text-white rounded-lg px-3 py-2"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="bg-black border border-gray-700 text-white rounded-lg px-3 py-2"
        >
          {Array.from({ length: 7 }, (_, i) => {
            const year = new Date().getFullYear() - 3 + i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;

          const pnl = dailyPnL[dateStr] || 0;
          const color =
            pnl > 0 ? "bg-green-700" : pnl < 0 ? "bg-red-700" : "bg-gray-800";

          return (
            <div
              key={day}
              className={`${color} p-2 rounded-md hover:scale-105 transition cursor-pointer`}
              title={`PnL: $${pnl.toFixed(2)}`}
            >
              <p className="text-gray-300 text-xs">{day}</p>
              {pnl !== 0 && (
                <p className="text-white text-xs font-semibold">
                  {pnl > 0 ? "+" : ""}
                  {pnl.toFixed(0)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
