# GreenDistrict

Платформа мониторинга зелёных насаждений с ИИ-анализом фото (Google Gemini).

**Стек:** NestJS · PostgreSQL · React · Vite · TypeScript

---

## Быстрый запуск

**1. Создай базу данных**
```bash
psql -U postgres -c "CREATE DATABASE green_district;"
```

**2. Запусти backend**
```bash
cd backend && npm install && npm run start:dev
```

**3. Запусти frontend**
```bash
cd frontend && npm install && npm run dev
```

Сайт откроется на `http://localhost:5173`

---

## Настройка `backend/.env`

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=твой_пользователь
DB_PASSWORD=твой_пароль
DB_NAME=green_district
JWT_SECRET=любая_строка
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=твой_ключ_gemini
PORT=3000
```

---

## Роли

| Роль | Доступ |
|------|--------|
| `citizen` | Создание и просмотр своих заявок |
| `inspector` | Управление статусами заявок |
| `admin` | Полный доступ + панель администратора |

Администратор по умолчанию: `admin@green.ru` / `admin123`
