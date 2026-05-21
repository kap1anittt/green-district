import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ObjectsPage.css';

interface GreenObject {
  id: number; name: string; type: string; address: string;
  status: string; description: string; plantedYear?: number;
}

const typeLabel: Record<string, string> = {
  tree: 'Дерево', bush: 'Кустарник', flowerbed: 'Клумба', lawn: 'Газон', park: 'Парк',
};
const statusLabel: Record<string, string> = {
  healthy: 'Здоровое', needs_attention: 'Требует внимания', critical: 'Критично',
};
const statusBadge: Record<string, string> = {
  healthy: 'badge-resolved', needs_attention: 'badge-medium', critical: 'badge-critical',
};
const typeFilters = [
  ['', 'Все типы'], ['tree', 'Деревья'], ['bush', 'Кустарники'],
  ['flowerbed', 'Клумбы'], ['lawn', 'Газоны'], ['park', 'Парки'],
];

export default function ObjectsPage() {
  const { user } = useAuth();
  const [objects, setObjects] = useState<GreenObject[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/green-objects').then(r => setObjects(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = filter ? objects.filter(o => o.type === filter) : objects;

  return (
    <div className="objects-page">
      <div className="objects-header">
        <div>
          <h1>Зелёные объекты</h1>
          <p>Деревья, кустарники, клумбы и газоны района</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'inspector') && (
          <Link to="/objects/new" className="btn btn-primary">Добавить объект</Link>
        )}
      </div>

      <div className="objects-controls">
        <div className="filter-chips">
          {typeFilters.map(([val, label]) => (
            <button
              key={val}
              className={`chip ${filter === val ? 'active' : ''}`}
              onClick={() => setFilter(val)}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="objects-count">{filtered.length} объектов</span>
      </div>

      {loading ? (
        <div className="loading" />
      ) : filtered.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon-box">Нет данных</div>
          <h3>Объектов не найдено</h3>
          <p>Попробуйте изменить фильтр или добавьте первый объект</p>
        </div>
      ) : (
        <div className="objects-grid">
          {filtered.map(obj => (
            <div key={obj.id} className="object-card card">
              <div className="object-card-header">
                <div className="object-type-badge">{typeLabel[obj.type]}</div>
                <span className={`badge ${statusBadge[obj.status]}`}>{statusLabel[obj.status]}</span>
              </div>
              <div className="object-color-bar" data-type={obj.type} />
              <h3 className="object-name">{obj.name}</h3>
              <div className="object-address">{obj.address}</div>
              {obj.plantedYear && (
                <div className="object-year">Посажено в {obj.plantedYear} году</div>
              )}
              {obj.description && (
                <p className="object-desc">{obj.description.slice(0, 90)}</p>
              )}
              <div className="object-card-footer">
                <Link to="/reports/new" className="btn btn-secondary btn-sm">Сообщить о проблеме</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
