import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { authService, setTokens } from './services/api';

export default function Login({ onLoggedIn }) {
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const r = await authService.login(username, password);
      setTokens({ access: r.data.access, refresh: r.data.refresh });
      onLoggedIn?.();
    } catch {
      setErr('Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: '4rem auto' }}>
      <h2>Entrar</h2>
      <form onSubmit={handleSubmit} className="p-fluid" style={{ display: 'grid', gap: '0.75rem' }}>
        <span className="p-float-label">
          <InputText id="username" value={username} onChange={(e) => setU(e.target.value)} />
          <label htmlFor="username">Usuário</label>
        </span>
        <span className="p-float-label">
          <Password id="password" value={password} onChange={(e) => setP(e.target.value)} feedback={false} toggleMask />
          <label htmlFor="password">Senha</label>
        </span>
        {err && <small className="p-error">{err}</small>}
        <Button type="submit" label="Login" icon="pi pi-sign-in" loading={loading} />
      </form>
    </div>
  );
}