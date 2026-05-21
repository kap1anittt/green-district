import { useEffect, useState } from 'react';
import api from '../services/api';
import './AdminPage.css';

interface Report { id: number; description: string; status: string; severity: string; problemType: string; createdAt: string; user?: { name: string }; }
interface User { id: number; name: string; email: string; role: string; createdAt: string; }
interface GreenObject { id: number; name: string; type: string; address: string; status: string; }


export default function AdminPage() {
  const [tab, setTab] = useState<'reports' | 'users' | 'objects'>('reports');
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [objects, setObjects] = useState<GreenObject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (tab === 'reports') api.get('/reports').then(r => setReports(r.data)).finally(() => setLoading(false));
    if (tab === 'users') api.get('/users').then(r => setUsers(r.data)).finally(() => setLoading(false));
    if (tab === 'objects') api.get('/green-objects').then(r => setObjects(r.data)).finally(() => setLoading(false));
  }, [tab]);

  const updateStatus = async (id: number, status: string) => {
    await api.put(`/reports/${id}/status`, { status, comment: `Статус изменён администратором` });
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const deleteReport = async (id: number) => {
    if (!confirm('Удалить заявку?')) return;
    await api.delete(`/reports/${id}`);
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const deleteObject = async (id: number) => {
    if (!confirm('Удалить объект?')) return;
    await api.delete(`/green-objects/${id}`);
    setObjects(prev => prev.filter(o => o.id !== id));
  };

  return (
    <div className="admin-page">
      <div className="page-header"><h1>Панель администратора</h1><p>Управление заявками, пользователями и объектами</p></div>

      <div className="admin-tabs">
        <button className={`admin-tab ${tab === 'reports' ? 'active' : ''}`} onClick={() => setTab('reports')}>Заявки ({reports.length})</button>
        <button className={`admin-tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>Пользователи</button>
        <button className={`admin-tab ${tab === 'objects' ? 'active' : ''}`} onClick={() => setTab('objects')}>Объекты</button>
      </div>

      {loading && <div className="loading">Загрузка...</div>}

      {!loading && tab === 'reports' && (
        <div className="card">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Тип проблемы</th><th>Описание</th><th>Автор</th><th>Статус</th><th>Дата</th><th>Действия</th></tr></thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td>#{r.id}</td>
                  <td>{r.problemType || '—'}</td>
                  <td className="td-desc">{r.description.slice(0, 50)}...</td>
                  <td>{r.user?.name || '—'}</td>
                  <td>
                    <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)} className="status-select">
                      <option value="new">Новая</option>
                      <option value="in_progress">В работе</option>
                      <option value="resolved">Решена</option>
                      <option value="rejected">Отклонена</option>
                    </select>
                  </td>
                  <td>{new Date(r.createdAt).toLocaleDateString('ru')}</td>
                  <td><button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => deleteReport(r.id)}>Удалить</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'users' && (
        <div className="card">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Имя</th><th>Email</th><th>Роль</th><th>Дата</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>#{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge badge-${u.role === 'admin' ? 'critical' : u.role === 'inspector' ? 'medium' : 'new'}`}>{u.role}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString('ru')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'objects' && (
        <div className="card">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Название</th><th>Тип</th><th>Адрес</th><th>Статус</th><th>Действия</th></tr></thead>
            <tbody>
              {objects.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.name}</td>
                  <td>{o.type}</td>
                  <td>{o.address}</td>
                  <td><span className={`badge badge-${o.status === 'healthy' ? 'resolved' : o.status === 'critical' ? 'critical' : 'medium'}`}>{o.status}</span></td>
                  <td><button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => deleteObject(o.id)}>Удалить</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
