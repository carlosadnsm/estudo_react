import { useState, useEffect } from 'react';
import './App.css';
import ProductTable from './components/ProductTable';
import Login from './Login';
import { clearTokens } from './services/api';

function isAuthed() {
  return !!localStorage.getItem('access');
}

export default function App() {
  const [authed, setAuthed] = useState(isAuthed());

  useEffect(() => {
    const onStorage = () => setAuthed(isAuthed());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    clearTokens();
    setAuthed(false);
  };

  if (!authed) return <Login onLoggedIn={() => setAuthed(true)} />;

  return (
    <div className="app-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Agromercantil</h1>
        <button className="p-button p-button-sm p-button-danger" onClick={handleLogout}>
          Sair
        </button>
      </header>
      <main>
          <ProductTable />
      </main>
    </div>
  );
}