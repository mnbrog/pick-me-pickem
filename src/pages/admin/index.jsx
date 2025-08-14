import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

export default function AdminHome() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const { data: seasons = [] } = useQuery({
    queryKey: ['seasons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .order('created_at');
      if (error) throw error;
      return data;
    },
  });

  const createSeason = async (e) => {
    e.preventDefault();
    await supabase.from('seasons').insert({ name });
    setName('');
    queryClient.invalidateQueries({ queryKey: ['seasons'] });
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Admin</h1>
      <form onSubmit={createSeason} className="mb-4 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Season name"
          className="border p-2"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </form>
      <ul className="mb-4 list-disc pl-5">
        {seasons.map((s) => (
          <li key={s.id}>{s.name}</li>
        ))}
      </ul>
      <div className="flex gap-4">
        <Link className="text-blue-600 underline" to="teams">Teams</Link>
        <Link className="text-blue-600 underline" to="games">Games</Link>
        <Link className="text-blue-600 underline" to="import">Import</Link>
      </div>
    </div>
  );
}
