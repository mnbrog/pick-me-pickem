import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';
import AuthGate from './components/AuthGate';

export default function App() {
  return (
    <AuthGate>
      <NavBar />
      <main className="p-4">
        <Outlet />
      </main>
    </AuthGate>
  );
}
