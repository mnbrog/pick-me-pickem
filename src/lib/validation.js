import { z } from 'zod';

export const teamSchema = z.object({
  id: z.string().uuid().optional(),
  season_id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  short_name: z.string().min(1, 'Short name is required'),
  primary_color: z.string().optional().nullable(),
});

export const gameSchema = z.object({
  id: z.string().uuid().optional(),
  season_id: z.string().uuid(),
  team_id: z.string().uuid(),
  date: z.string().min(1, 'Date is required'),
  opponent: z.string().min(1, 'Opponent is required'),
  home_away: z.enum(['HOME', 'AWAY', 'NEUTRAL']),
  lock_at: z.string().optional().nullable(),
});
