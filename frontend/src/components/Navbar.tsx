import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <div className="logo-leaf">G</div>
        GreenDistrict
      </Link>

      <div className="navbar-links">
        <Link to="/reports" className={`nav-link ${isActive('/reports') ? 'active' : ''}`}>Заявки</Link>
        <Link to="/objects" className={`nav-link ${isActive('/objects') ? 'active' : ''}`}>Объекты</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>Администрирование</Link>
        )}
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <Link to="/dashboard" className="user-pill">
              <div className="user-avatar">{user.name[0].toUpperCase()}</div>
              <span>{user.name}</span>
              <span className={`role-tag role-${user.role}`}>
                {user.role === 'admin' ? 'Администратор' : user.role === 'inspector' ? 'Инспектор' : 'Житель'}
              </span>
            </Link>
            <Link to="/reports/new" className="btn btn-primary btn-sm">Новая заявка</Link>
            <button className="btn btn-ghost btn-sm" onClick={() => { logout(); navigate('/'); }}>Выйти</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary btn-sm">Войти</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Регистрация</Link>
          </>
        )}
      </div>
    </nav>
  );
}
