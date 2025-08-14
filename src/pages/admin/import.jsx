import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as XLSX from 'xlsx';
import { supabase } from '../../lib/supabase';
import { upsertTeam, upsertGame } from '../../lib/queries';

export default function AdminImport() {
  const [seasonId, setSeasonId] = useState('');
  const { data: seasons = [] } = useQuery({
    queryKey: ['seasons'],
    queryFn: async () => {
      const { data, error } = await supabase.from('seasons').select('*');
      if (error) throw error;
      return data;
    },
  });

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !seasonId) return;
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data);
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    for (const row of rows) {
      const team = await upsertTeam({
        season_id: seasonId,
        name: row.TeamName,
        short_name: row.TeamName.slice(0, 3).toUpperCase(),
      });
      await upsertGame({
        season_id: seasonId,
        team_id: team.id,
        date: row.DateISO,
        opponent: row.Opponent,
        home_away: row.HomeAway,
      });
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Import</h1>
      <select
        value={seasonId}
        onChange={(e) => setSeasonId(e.target.value)}
        className="border p-2 mb-4"
      >
        <option value="">Select season</option>
        {seasons.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      {seasonId && (
        <input type="file" accept=".xlsx,.xls" onChange={onFile} />
      )}
    </div>
  );
}
