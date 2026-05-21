# GreenDistrict

Платформа мониторинга зелёных насаждений района с анализом фото на основе ИИ.

## Стек

- **Backend**: NestJS, TypeORM, PostgreSQL, JWT
- **Frontend**: React, Vite, TypeScript
- **AI**: Google Gemini 2.0 Flash

## Запуск

### Backend

```bash
cd backend
cp .env.example .env
# Заполни .env своими данными
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Роли

| Роль | Возможности |
|------|-------------|
| citizen | Создание заявок, просмотр своих заявок |
| inspector | Управление статусами заявок |
| admin | Полный доступ |

## Дефолтный администратор

После первого запуска создай пользователя через `/api/auth/register` или используй `admin@green.ru` / `admin123`.
