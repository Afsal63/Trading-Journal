"use client";

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
  // Filter entries based on selected month & year
  const filteredEntries = entries.filter((entry) => {
    const date = new Date(entry.date);
    return (
      date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
    );
  });

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
      <h2 className="text-xl font-semibold mb-4">
        📜 Trade Journal Records —{" "}
        {new Date(selectedYear, selectedMonth).toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </h2>

      {filteredEntries.length === 0 ? (
        <p className="text-gray-500">No entries found for this month.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-gray-800 rounded-2xl overflow-hidden shadow-md border border-gray-700 hover:border-green-400 transition-all duration-200 hover:scale-[1.02]"
            >
              {/* Image Section */}
              {entry.photo && (
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={entry.photo}
                    alt="journal"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Details */}
              <div className="p-4 space-y-2">
                <p className="text-sm text-gray-400">{entry.date}</p>
                <p
                  className={`text-2xl font-bold ${
                    entry.pnl > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  ₹{entry.pnl.toLocaleString()}
                </p>
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
                    onClick={() => onDelete(entry.id)}
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