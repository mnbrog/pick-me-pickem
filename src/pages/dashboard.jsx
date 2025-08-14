import { useQuery } from '@tanstack/react-query';
import { fetchGames } from '../lib/queries';
import { supabase } from '../lib/supabase';
import GameCard from '../components/GameCard';
import { useAuth } from '../components/AuthGate';

export default function DashboardPage() {
  const { session } = useAuth();
  const { data: games = [] } = useQuery({
    queryKey: ['games'],
    queryFn: () => fetchGames(),
  });
  const { data: picks = [] } = useQuery({
    queryKey: ['picks', session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('picks')
        .select('*')
        .eq('user_id', session.user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Upcoming Games</h1>
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          pick={picks.find((p) => p.game_id === game.id)?.pick_for}
        />
      ))}
    </div>
  );
}
