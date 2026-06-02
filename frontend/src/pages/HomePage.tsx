import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Платформа умного мониторинга
          </div>
          <h1>
            Зелёный<br />
            <span className="accent">район</span> под<br />
            защитой ИИ
          </h1>
          <p>
            Фотографируйте проблемы с деревьями, газонами и клумбами.
            Gemini AI автоматически определит тип нарушения и его серьёзность,
            а городские службы оперативно устранят его.
          </p>
          <div className="hero-cta">
            {user ? (
              <Link to="/reports/new" className="btn btn-primary btn-lg">Сообщить о проблеме</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Начать бесплатно</Link>
                <Link to="/reports" className="btn btn-secondary btn-lg">Смотреть заявки</Link>
              </>
            )}
          </div>
        </div>

        <div className="hero-right">
          <div className="float-badge float-badge-1">
            <span className="float-dot dot-green" />
            ИИ-анализ за 3 секунды
          </div>
          <div className="ai-card">
            <div className="ai-card-inner">
            <div className="ai-photo">
              <div className="ai-photo-placeholder">Фото насаждения</div>
            </div>
            <div className="ai-scanning">
              <span>Gemini AI анализирует...</span>
              <div className="ai-scan-bar"><div className="ai-scan-fill" /></div>
            </div>
            <div className="ai-result-pill">Засыхание дерева</div>
            <div className="ai-severity-pill">Критично</div>
            <p className="ai-desc-text">
              Обнаружены признаки грибкового заболевания коры.
              Рекомендуется срочное обследование специалистом в течение 48 часов.
            </p>
            </div>
          </div>
          <div className="float-badge float-badge-2">
            <span className="float-dot dot-blue" />
            Заявка №247 создана
          </div>
        </div>
      </section>

      <section className="steps-section">
        <div style={{ textAlign: 'center' }}>
          <div className="section-label">Как это работает</div>
          <h2>4 шага до решения проблемы</h2>
          <p>От фотографии до устранения нарушения — всё автоматизировано</p>
        </div>
        <div className="steps-grid">
          {[
            { num: '01', title: 'Сфотографируйте', desc: 'Загрузите фото проблемного дерева, газона или клумбы прямо с телефона' },
            { num: '02', title: 'ИИ анализирует', desc: 'Gemini AI определяет тип нарушения и оценивает серьёзность за секунды' },
            { num: '03', title: 'Заявка создана', desc: 'Система направляет заявку ответственным инспекторам района автоматически' },
            { num: '04', title: 'Проблема решена', desc: 'Вы отслеживаете статус в реальном времени и получаете уведомление' },
          ].map(s => (
            <div key={s.num} className="step-card">
              <div className="step-num"><span className="step-num-text">{s.num}</span></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
