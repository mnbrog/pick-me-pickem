import { useAuth } from './AuthGate';
import { submitPick } from '../lib/queries';

export default function GameCard({ game, pick }) {
  const { session } = useAuth();

  const choose = async (choice) => {
    if (!session) return;
    await submitPick({ game_id: game.id, user_id: session.user.id, pick_for: choice });
  };

  const isLocked = game.lock_at && new Date(game.lock_at) < new Date();

  return (
    <div className="border p-4 rounded mb-2">
      <div className="font-semibold">
        {game.team_name} vs {game.opponent}
      </div>
      <div className="text-sm">{new Date(game.date).toLocaleString()}</div>
      {game.status === 'FINAL' && (
        <div className="mt-2 text-sm">
          Result: {game.result === 'W' ? `${game.team_name} Win` : `${game.team_name} Loss`}
        </div>
      )}
      {game.status === 'SCHEDULED' && !isLocked && (
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => choose(game.team_name)}
            className={`px-2 py-1 border rounded ${pick === game.team_name ? 'bg-green-200' : ''}`}
          >
            {game.team_name}
          </button>
          <button
            onClick={() => choose(game.opponent)}
            className={`px-2 py-1 border rounded ${pick === game.opponent ? 'bg-green-200' : ''}`}
          >
            {game.opponent}
          </button>
        </div>
      )}
    </div>
  );
}
