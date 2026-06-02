# GreenDistrict

Платформа мониторинга зелёных насаждений с ИИ-анализом фото (Google Gemini).

**Стек:** NestJS · PostgreSQL · React · Vite · TypeScript

---

## Запуск (3 шага)

**1. Создай базу данных**
```bash
psql -U postgres -c "CREATE DATABASE green_district;"
```

**2. Запусти backend**
```bash
cd backend
cp .env.example .env
# Открой .env и укажи свои DB_USERNAME, DB_PASSWORD, GEMINI_API_KEY
npm install
npm run start:dev
```

**3. Запусти frontend** (в новом терминале)
```bash
cd frontend
npm install
npm run dev
```

Сайт откроется на `http://localhost:5173` (или следующем свободном порту).

---

## Файл `backend/.env`

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=твой_пользователь_postgres
DB_PASSWORD=твой_пароль
DB_NAME=green_district
JWT_SECRET=любая_строка
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=твой_ключ_gemini
PORT=3000
```

> `JWT_EXPIRES_IN=7d` — обязательная строка, без неё авторизация не работает.

---

## Роли

| Роль | Доступ |
|------|--------|
| `citizen` | Создание и просмотр своих заявок |
| `inspector` | Управление статусами заявок |
| `admin` | Полный доступ + панель администратора |

Зарегистрируй первого пользователя через форму, затем смени роль в БД:
```sql
UPDATE users SET role='admin' WHERE email='твой@email.com';
```
