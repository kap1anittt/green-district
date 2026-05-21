import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await login(form.email, form.password); navigate('/dashboard'); }
    catch (err: any) { setError(err.response?.data?.message || 'Неверный email или пароль'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-card">
          <div className="auth-logo-wrap">
            <div className="auth-logo-icon">G</div>
            <span className="auth-logo-text">GreenDistrict</span>
          </div>
          <h1>С возвращением!</h1>
          <p className="sub">Войдите в свой аккаунт</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="your@email.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Пароль</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            {error && <div className="error-msg">{error}</div>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
          <p className="auth-link">Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-right-title">Мониторинг<br />зелени<br /><span>с ИИ</span></div>
        <p className="auth-right-sub">Платформа для жителей и инспекторов района. Следим за деревьями, газонами и клумбами вместе.</p>
        <div className="auth-features">
          {[
            { icon: 'AI', title: 'Анализ фото за 3 сек', desc: 'Gemini AI определяет тип проблемы автоматически' },
            { icon: 'GEO', title: 'Геолокация объектов', desc: 'Все зелёные объекты района на одной карте' },
            { icon: 'OK', title: 'Отслеживание статуса', desc: 'Следите за ходом решения вашей заявки' },
          ].map(f => (
            <div key={f.title} className="auth-feature">
              <div className="auth-feature-icon">{f.icon}</div>
              <div><strong>{f.title}</strong>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
