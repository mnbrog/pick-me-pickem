import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/login';
import DashboardPage from './pages/dashboard';
import StandingsPage from './pages/standings';
import AdminHome from './pages/admin/index';
import AdminTeams from './pages/admin/teams';
import AdminGames from './pages/admin/games';
import AdminImport from './pages/admin/import';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'standings', element: <StandingsPage /> },
      {
        path: 'admin',
        children: [
          { index: true, element: <AdminHome /> },
          { path: 'teams', element: <AdminTeams /> },
          { path: 'games', element: <AdminGames /> },
          { path: 'import', element: <AdminImport /> },
        ],
      },
    ],
  },
  { path: '/login', element: <LoginPage /> },
]);

export default router;
