import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getApiUrl } from '../config';

export function Register({ navigate }: { navigate: (tab: string) => void }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch(`${getApiUrl()}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar');
      
      login(data.token, data.user);
      navigate('home');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-surface p-8 rounded-xl w-full max-w-md border border-white/5">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">Criar Conta</h2>
        
        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm text-textSecondary mb-1">Nome de Usuário</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-background border border-white/10 rounded px-4 py-2 text-white focus:border-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-textSecondary mb-1">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-background border border-white/10 rounded px-4 py-2 text-white focus:border-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-textSecondary mb-1">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-background border border-white/10 rounded px-4 py-2 text-white focus:border-primary outline-none"
              required
            />
          </div>
          <button type="submit" className="w-full bg-primary text-background font-bold py-3 rounded mt-4 hover:bg-opacity-90 transition-all">
            Cadastrar
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-textSecondary">
          Já possui conta? <button type="button" onClick={() => navigate('login')} className="text-primary hover:underline bg-transparent border-none cursor-pointer">Faça login</button>
        </p>
      </div>
    </div>
  );
}
