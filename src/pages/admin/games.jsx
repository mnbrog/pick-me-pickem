import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../lib/supabase';
import { upsertGame } from '../../lib/queries';
import { gameSchema } from '../../lib/validation';

export default function AdminGames() {
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
  const { data: games = [] } = useQuery({
    queryKey: ['games', seasonId],
    queryFn: async () => {
      if (!seasonId) return [];
      const { data, error } = await supabase
        .from('games_with_winner')
        .select('*')
        .eq('season_id', seasonId)
        .order('date');
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
  } = useForm({ resolver: zodResolver(gameSchema) });

  useEffect(() => {
    reset({ season_id: seasonId });
  }, [seasonId, reset]);

  const onSubmit = async (values) => {
    await upsertGame(values);
    reset({ season_id: seasonId });
    queryClient.invalidateQueries({ queryKey: ['games', seasonId] });
  };

  const setResult = async (game, result) => {
    await supabase
      .from('games')
      .update({ result, status: 'FINAL' })
      .eq('id', game.id);
    queryClient.invalidateQueries({ queryKey: ['games', seasonId] });
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Games</h1>
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
            <select {...register('team_id')} className="border p-2 w-full">
              <option value="">Select team</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {errors.team_id && <p className="text-red-600 text-sm">Team required</p>}
          </div>
          <div>
            <input type="datetime-local" {...register('date')} className="border p-2 w-full" />
            {errors.date && <p className="text-red-600 text-sm">Date required</p>}
          </div>
          <div>
            <input {...register('opponent')} placeholder="Opponent" className="border p-2 w-full" />
            {errors.opponent && <p className="text-red-600 text-sm">Opponent required</p>}
          </div>
          <div>
            <select {...register('home_away')} className="border p-2 w-full">
              <option value="HOME">Home</option>
              <option value="AWAY">Away</option>
              <option value="NEUTRAL">Neutral</option>
            </select>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Save Game</button>
        </form>
      )}
      <ul className="space-y-2">
        {games.map((g) => (
          <li key={g.id} className="border p-2">
            <div>
              {g.team_name} vs {g.opponent} - {new Date(g.date).toLocaleString()}
            </div>
            {g.status === 'SCHEDULED' ? (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => setResult(g, 'W')}
                  className="px-2 py-1 border rounded"
                >
                  Set W
                </button>
                <button
                  onClick={() => setResult(g, 'L')}
                  className="px-2 py-1 border rounded"
                >
                  Set L
                </button>
              </div>
            ) : (
              <div className="mt-2 text-sm">
                Final: {g.result === 'W' ? `${g.team_name} Win` : `${g.team_name} Loss`}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
