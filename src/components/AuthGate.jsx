import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({ session: null, profile: null });
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export default function AuthGate({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const ensureProfile = async () => {
      if (!session) return;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (!data) {
        const { data: created } = await supabase
          .from('profiles')
          .insert({ id: session.user.id })
          .select()
          .single();
        setProfile(created);
      } else {
        setProfile(data);
      }
    };
    ensureProfile();
  }, [session]);

  useEffect(() => {
    if (!session && location.pathname !== '/login') navigate('/login');
    if (session && location.pathname === '/login') navigate('/');
  }, [session, location.pathname, navigate]);

  useEffect(() => {
    const gamesChannel = supabase
      .channel('games')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, () => {
        queryClient.invalidateQueries({ queryKey: ['games'] });
        queryClient.invalidateQueries({ queryKey: ['standings'] });
      })
      .subscribe();
    const picksChannel = supabase
      .channel('picks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'picks' }, () => {
        queryClient.invalidateQueries({ queryKey: ['games'] });
        queryClient.invalidateQueries({ queryKey: ['standings'] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(gamesChannel);
      supabase.removeChannel(picksChannel);
    };
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ session, profile }}>
      {children}
    </AuthContext.Provider>
  );
}
