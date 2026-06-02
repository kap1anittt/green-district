import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ReportDetailPage.css';

interface Report {
  id: number; description: string; status: string; severity: string;
  problemType: string; address: string; aiAnalysis: string;
  photoUrl?: string; createdAt: string;
  user?: { name: string; email: string };
  greenObject?: { name: string; type: string; address: string };
  history?: { id: number; oldStatus: string; newStatus: string; comment: string; changedBy: string; changedAt: string }[];
}

const statusLabel: Record<string, string> = {
  new: 'Новая', in_progress: 'В работе', resolved: 'Решена', rejected: 'Отклонена'
};
const severityLabel: Record<string, string> = {
  low: 'Низкая', medium: 'Средняя', high: 'Высокая', critical: 'Критическая'
};

export default function ReportDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api.get(`/reports/${id}`).then(r => setReport(r.data)).finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string, comment: string) => {
    setUpdating(true);
    try {
      const { data } = await api.put(`/reports/${id}/status`, { status, comment });
      setReport(data);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (!report) return <div className="loading">Заявка не найдена</div>;

  const canManage = user?.role === 'admin' || user?.role === 'inspector';

  return (
    <div className="report-detail-bg">
    <div className="report-detail">
      <button className="btn btn-secondary back-btn" onClick={() => navigate(-1)}>← Назад</button>

      <div className="report-detail-grid">
        <div className="report-main">
          {report.photoUrl && (
            <div className="report-photo-full">
              <img src={`http://localhost:3000${report.photoUrl}`} alt="Фото проблемы" />
            </div>
          )}

          <div className="card">
            <div className="detail-badges">
              <span className={`badge badge-${report.status}`}>{statusLabel[report.status]}</span>
              <span className={`badge badge-${report.severity}`}>{severityLabel[report.severity]}</span>
            </div>

            <h1 className="detail-title">{report.problemType || 'Проблема с растением'}</h1>
            <p className="detail-desc">{report.description}</p>

            {report.address && (
              <div className="detail-meta">{report.address}</div>
            )}
            <div className="detail-meta">{new Date(report.createdAt).toLocaleString('ru')}</div>
            {report.user && <div className="detail-meta">{report.user.name}</div>}
          </div>

          {report.aiAnalysis && (
            <div className="card ai-result-card">
              <h2>Анализ ИИ</h2>
              <div className="ai-result-content">
                <div className="ai-result-type">
                  <span className="ai-result-label">Тип проблемы:</span>
                  <strong>{report.problemType}</strong>
                </div>
                <p className="ai-result-text">{report.aiAnalysis}</p>
              </div>
            </div>
          )}
        </div>

        <div className="report-sidebar">
          {canManage && (
            <div className="card">
              <h2>Управление заявкой</h2>
              <div className="status-actions">
                {[
                  { s: 'in_progress', label: 'Взять в работу', comment: 'Заявка взята в работу' },
                  { s: 'resolved', label: 'Отметить решённой', comment: 'Проблема устранена' },
                  { s: 'rejected', label: 'Отклонить', comment: 'Заявка отклонена' },
                ].filter(a => a.s !== report.status).map(action => (
                  <button key={action.s} className="btn btn-secondary status-btn"
                    onClick={() => updateStatus(action.s, action.comment)}
                    disabled={updating}>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {report.history && report.history.length > 0 && (
            <div className="card">
              <h2>История изменений</h2>
              <div className="history-list">
                {report.history.map(h => (
                  <div key={h.id} className="history-item">
                    <div className="history-status">
                      {h.oldStatus && <><span className={`badge badge-${h.oldStatus}`}>{statusLabel[h.oldStatus]}</span> → </>}
                      <span className={`badge badge-${h.newStatus}`}>{statusLabel[h.newStatus]}</span>
                    </div>
                    {h.comment && <div className="history-comment">{h.comment}</div>}
                    <div className="history-meta">{h.changedBy} · {new Date(h.changedAt).toLocaleString('ru')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
