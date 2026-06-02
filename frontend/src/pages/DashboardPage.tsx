import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

interface Report {
  id: number; description: string; status: string;
  severity: string; problemType: string; createdAt: string; photoUrl?: string;
}
interface Stats {
  totalReports: number; totalObjects: number; totalUsers: number;
  byStatus: { status: string; count: string }[];
  bySeverity: { severity: string; count: string }[];
  byType: { type: string; count: string }[];
}

const statusLabel: Record<string, string> = { new:'Новая', in_progress:'В работе', resolved:'Решена', rejected:'Отклонена' };
const severityLabel: Record<string, string> = { low:'Низкая', medium:'Средняя', high:'Высокая', critical:'Критическая' };

export default function DashboardPage() {
  const { user } = useAuth();
  const [myReports, setMyReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/reports/my'), api.get('/stats')])
      .then(([r, s]) => { setMyReports(r.data); setStats(s.data); })
      .finally(() => setLoading(false));
  }, []);

  const now = new Date().getHours();
  const greeting = now < 12 ? 'Доброе утро' : now < 18 ? 'Добрый день' : 'Добрый вечер';

  if (loading) return <div className="loading" />;

  const resolved = stats?.byStatus.find(s => s.status === 'resolved')?.count || '0';
  const critical = stats?.bySeverity.find(s => s.severity === 'critical')?.count || '0';

  return (
    <div className="dashboard-bg">
    <div className="dashboard">
      <div className="dash-header">
        <div className="dash-header-left">
          <h1>{greeting}, {user?.name.split(' ')[0]}</h1>
          <p>Вот что происходит в вашем районе сегодня</p>
        </div>
        <Link to="/reports/new" className="btn btn-primary">Новая заявка</Link>
      </div>

      {stats && (
        <div className="kpi-grid">
          {[
            { label: 'Всего заявок',   value: stats.totalReports, trend: 'в базе данных' },
            { label: 'Объектов',       value: stats.totalObjects, trend: 'зелёных насаждений' },
            { label: 'Решено',         value: +resolved,          trend: 'проблем устранено' },
            { label: 'Критических',    value: +critical,          trend: 'требуют внимания' },
          ].map((k, i) => (
            <div key={k.label} className={`kpi-card kpi-card-${i}`}>
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-trend">{k.trend}</div>
            </div>
          ))}
        </div>
      )}

      <div className="dashboard-grid">
        <div className="card">
          <div className="section-title">
            Мои заявки ({myReports.length})
            <Link to="/reports">Все заявки</Link>
          </div>
          {myReports.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" style={{ fontSize: 14, background: 'var(--gray-100)', padding: '8px 16px', borderRadius: 8, color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>Нет заявок</div>
              <h3>Заявок пока нет</h3>
              <p>Сообщите о первой проблеме с зелёными насаждениями</p>
              <Link to="/reports/new" className="btn btn-primary">Создать заявку</Link>
            </div>
          ) : (
            myReports.map(r => (
              <Link to={`/reports/${r.id}`} key={r.id} className="report-row">
                <div className="report-thumb">
                  {r.photoUrl ? <img src={`http://localhost:3000${r.photoUrl}`} alt="" /> : <span className="thumb-placeholder" />}
                </div>
                <div className="report-row-info">
                  <div className="report-row-type">{r.problemType || 'Проблема с растением'}</div>
                  <div className="report-row-desc">{r.description}</div>
                  <div className="report-row-date">{new Date(r.createdAt).toLocaleDateString('ru', { day:'numeric', month:'long' })}</div>
                </div>
                <div className="report-row-badges">
                  <span className={`badge badge-${r.status}`}>{statusLabel[r.status]}</span>
                  <span className={`badge badge-${r.severity}`}>{severityLabel[r.severity]}</span>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="card">
          <div className="section-title">Топ проблем</div>
          {stats && stats.byType.length > 0 ? (
            stats.byType.slice(0, 7).map((t, i) => {
              const max = +stats.byType[0].count;
              return (
                <div key={i} className="type-row">
                  <span className="type-name-lbl">{t.type}</span>
                  <div className="type-bar-track">
                    <div className="type-bar-fill" style={{ width: `${(+t.count / max) * 100}%` }} />
                  </div>
                  <span className="type-count-lbl">{t.count}</span>
                </div>
              );
            })
          ) : (
            <div style={{ color: 'var(--gray-400)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
              Данных пока нет
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
