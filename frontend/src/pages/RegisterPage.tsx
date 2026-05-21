import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (form.password.length < 6) { setError('Пароль минимум 6 символов'); return; }
    setLoading(true);
    try { await register(form.name, form.email, form.password, form.age ? +form.age : undefined); navigate('/dashboard'); }
    catch (err: any) { setError(err.response?.data?.message || 'Ошибка регистрации'); }
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
          <h1>Создать аккаунт</h1>
          <p className="sub">Присоединяйтесь к платформе</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Имя *</label>
              <input placeholder="Иван Иванов" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" placeholder="your@email.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Пароль * (мин. 6)</label>
                <input type="password" placeholder="••••••" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Возраст</label>
                <input type="number" placeholder="25" min="1" max="120" value={form.age}
                  onChange={e => setForm({ ...form, age: e.target.value })} />
              </div>
            </div>
            {error && <div className="error-msg">{error}</div>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
          <p className="auth-link">Уже есть аккаунт? <Link to="/login">Войти</Link></p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-right-title">Город<br />становится<br /><span>умнее</span></div>
        <p className="auth-right-sub">Каждая заявка — это шаг к чистому и зелёному городу. Ваш голос важен.</p>
        <div className="auth-features">
          {[
            { icon: 'FREE', title: 'Бесплатно навсегда', desc: 'Регистрация и все функции полностью бесплатны' },
            { icon: 'SEC', title: 'Безопасно', desc: 'Данные защищены JWT токенами и шифрованием' },
            { icon: 'STAT', title: 'Аналитика', desc: 'Следите за статистикой проблем в вашем районе' },
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
