export default function PicksTable({ standings }) {
  const sorted = [...standings].sort((a, b) => {
    if (b.win_pct !== a.win_pct) return b.win_pct - a.win_pct;
    if (b.correct !== a.correct) return b.correct - a.correct;
    return a.full_name.localeCompare(b.full_name);
  });

  return (
    <table className="min-w-full border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Player</th>
          <th className="p-2 border">Correct</th>
          <th className="p-2 border">Played</th>
          <th className="p-2 border">Pending</th>
          <th className="p-2 border">Win %</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((row) => (
          <tr key={row.user_id} className="text-center">
            <td className="border p-2 text-left">{row.full_name}</td>
            <td className="border p-2">{row.correct}</td>
            <td className="border p-2">{row.played}</td>
            <td className="border p-2">{row.pending}</td>
            <td className="border p-2">{row.win_pct}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
