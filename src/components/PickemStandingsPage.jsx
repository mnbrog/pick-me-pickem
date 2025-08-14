import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchStandings } from '../lib/queries';
import PicksTable from './PicksTable';

export default function PickemStandingsPage() {
  const [search, setSearch] = useState('');
  const { data: standings = [] } = useQuery({
    queryKey: ['standings'],
    queryFn: () => fetchStandings(),
  });

  const filtered = standings.filter((row) =>
    row.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Standings</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search players"
        className="border p-2 mb-4 w-full max-w-sm"
      />
      <PicksTable standings={filtered} />
    </div>
  );
}
