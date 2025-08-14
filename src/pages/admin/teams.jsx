import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../lib/supabase';
import { upsertTeam } from '../../lib/queries';
import { teamSchema } from '../../lib/validation';

export default function AdminTeams() {
  const queryClient = useQueryClient();
  const [seasonId, setSeasonId] = useState('');
  const { data: seasons = [] } = useQuery({
    queryKey: ['seasons'],
    queryFn: async () => {
      const { data, error } = await supabase.from('seasons').select('*');
      if (error) throw error;
      return data;
    },
  });
  const { data: teams = [] } = useQuery({
    queryKey: ['teams', seasonId],
    queryFn: async () => {
      if (!seasonId) return [];
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('season_id', seasonId);
      if (error) throw error;
      return data;
    },
    enabled: !!seasonId,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(teamSchema) });

  useEffect(() => {
    reset({ season_id: seasonId });
  }, [seasonId, reset]);

  const onSubmit = async (values) => {
    await upsertTeam(values);
    reset({ season_id: seasonId });
    queryClient.invalidateQueries({ queryKey: ['teams', seasonId] });
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Teams</h1>
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
          <input type="hidden" {...register('season_id')} />
          <div>
            <input
              placeholder="Name"
              {...register('name')}
              className="border p-2 w-full"
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <input
              placeholder="Short name"
              {...register('short_name')}
              className="border p-2 w-full"
            />
            {errors.short_name && <p className="text-red-600 text-sm">{errors.short_name.message}</p>}
          </div>
          <div>
            <input
              placeholder="Color"
              {...register('primary_color')}
              className="border p-2 w-full"
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Save Team</button>
        </form>
      )}
      <ul className="list-disc pl-5">
        {teams.map((t) => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul>
    </div>
  );
}
