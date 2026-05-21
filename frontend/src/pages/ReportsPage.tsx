import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './ReportsPage.css';

interface Report {
  id: number; description: string; status: string; severity: string;
  problemType: string; address: string; createdAt: string; photoUrl?: string;
}

const statusLabel: Record<string, string> = { new:'Новая', in_progress:'В работе', resolved:'Решена', rejected:'Отклонена' };
const severityLabel: Record<string, string> = { low:'Низкая', medium:'Средняя', high:'Высокая', critical:'Критическая' };

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = filter ? `/reports?status=${filter}` : '/reports';
    api.get(url).then(r => setReports(r.data)).finally(() => setLoading(false));
  }, [filter]);

  const filters = [
    ['', 'Все'], ['new', 'Новые'], ['in_progress', 'В работе'],
    ['resolved', 'Решены'], ['rejected', 'Отклонены'],
  ];

  return (
    <div className="reports-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Заявки района</h1>
          <p>Сообщения о проблемах с зелёными насаждениями</p>
        </div>
        <Link to="/reports/new" className="btn btn-primary">Новая заявка</Link>
      </div>

      <div className="filter-bar">
        <div className="filter-chips">
          {filters.map(([val, label]) => (
            <button key={val} className={`chip ${filter === val ? 'active' : ''}`} onClick={() => setFilter(val)}>
              {label}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 13, color: 'var(--gray-400)' }}>{reports.length} заявок</span>
      </div>

      {loading ? <div className="loading" /> : reports.length === 0 ? (
        <div className="card empty-state">
            <h3>Заявок не найдено</h3>
          <p>Попробуйте изменить фильтр или создайте первую заявку</p>
          <Link to="/reports/new" className="btn btn-primary">Создать заявку</Link>
        </div>
      ) : (
        <div className="reports-grid">
          {reports.map(r => (
            <Link to={`/reports/${r.id}`} key={r.id} className="report-card card">
              <div className="report-card-img">
                {r.photoUrl
                  ? <img src={`http://localhost:3000${r.photoUrl}`} alt="" />
                  : <span className="report-no-photo" />}
                <div className="severity-overlay">
                  <span className={`badge badge-${r.severity}`}>{severityLabel[r.severity]}</span>
                </div>
              </div>
              <div className="report-card-body">
                <div className="report-card-type">{r.problemType || 'Проблема с насаждением'}</div>
                <p className="report-card-desc">{r.description.slice(0, 90)}{r.description.length > 90 ? '...' : ''}</p>
                {r.address && <div className="report-card-addr">{r.address}</div>}
                <div className="report-card-footer">
                  <span className={`badge badge-${r.status}`}>{statusLabel[r.status]}</span>
                  <span className="report-card-date">{new Date(r.createdAt).toLocaleDateString('ru')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
