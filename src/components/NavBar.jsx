import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthGate';

export default function NavBar() {
  const navigate = useNavigate();
  const { session, profile } = useAuth();
  if (!session) return null;

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex gap-4">
      <Link to="/">Dashboard</Link>
      <Link to="/standings">Standings</Link>
      {profile?.role === 'admin' && <Link to="/admin">Admin</Link>}
      <button onClick={signOut} className="ml-auto">Sign out</button>
    </nav>
  );
}
