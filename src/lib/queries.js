import { supabase } from './supabase';

export const fetchStandings = async (seasonId) => {
  let query = supabase.from('standings_view').select('*');
  if (seasonId) query = query.eq('season_id', seasonId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const fetchGames = async (seasonId) => {
  let query = supabase
    .from('games_with_winner')
    .select('*')
    .order('date');
  if (seasonId) query = query.eq('season_id', seasonId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const upsertTeam = async (team) => {
  const { data, error } = await supabase
    .from('teams')
    .upsert(team)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const upsertGame = async (game) => {
  const { data, error } = await supabase
    .from('games')
    .upsert(game)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const submitPick = async ({ game_id, user_id, pick_for }) => {
  const { data, error } = await supabase
    .from('picks')
    .upsert({ game_id, user_id, pick_for })
    .select()
    .single();
  if (error) throw error;
  return data;
};
