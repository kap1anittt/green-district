import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './NewReportPage.css';

export default function NewReportPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ description: '', address: '' });
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) { setError('Введите описание'); return; }
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      fd.append('description', form.description);
      if (form.address) fd.append('address', form.address);
      if (photo) fd.append('photo', photo);
      const { data } = await api.post('/reports', fd);
      navigate(`/reports/${data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка создания заявки');
      setLoading(false);
    }
  };

  return (
    <div className="new-report-wrap">
      <div className="new-report-card card">
        <h1>Новая заявка</h1>
        <p className="new-report-sub">
          Загрузите фото — Gemini AI автоматически определит тип проблемы и её серьёзность.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Фото проблемы</label>
            <div className={`upload-zone ${preview ? 'filled' : ''}`} onClick={() => fileRef.current?.click()}>
              {preview ? (
                <img src={preview} className="upload-preview" alt="preview" />
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-ico-box">Загрузить фото</div>
                  <div className="upload-hint">Нажмите или перетащите файл сюда · JPG, PNG до 10 МБ</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
            {preview && (
              <div className="upload-actions">
                <button type="button" className="btn btn-secondary btn-sm"
                  onClick={() => { setPhoto(null); setPreview(null); }}>
                  Удалить фото
                </button>
                <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{photo?.name}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Описание проблемы *</label>
            <textarea rows={4} placeholder="Опишите что происходит с деревом, газоном или клумбой..."
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Адрес (необязательно)</label>
            <input placeholder="ул. Ленина, 15 или парк Победы"
              value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>

          {loading && (
            <div className="ai-banner">
              <div className="ai-spinner" />
              <div>
                <strong style={{ display: 'block', marginBottom: 2 }}>Gemini AI анализирует фото...</strong>
                Определяем тип проблемы и серьёзность
              </div>
            </div>
          )}

          {error && <div className="error-msg">{error}</div>}

          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Отправка...' : 'Создать заявку'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
}
