# GreenDistrict

Платформа мониторинга зелёных насаждений с ИИ-анализом фото (Google Gemini).

## Стек

- **Backend**: NestJS · TypeORM · PostgreSQL · JWT
- **Frontend**: React · Vite · TypeScript
- **AI**: Google Gemini 2.0 Flash

## Запуск

### 1. База данных

Создай БД в PostgreSQL:

```sql
CREATE DATABASE green_district;
```

### 2. Backend

```bash
cd backend
npm install
```

Создай файл `backend/.env`:

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

```bash
npm run start:dev
```

Backend запустится на `http://localhost:3000`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend запустится на `http://localhost:5173`

## Роли

| Роль | Доступ |
|------|--------|
| `citizen` | Создание и просмотр своих заявок |
| `inspector` | Управление статусами заявок |
| `admin` | Полный доступ + панель администратора |

Администратор по умолчанию: `admin@green.ru` / `admin123`
