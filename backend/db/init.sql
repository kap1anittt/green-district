-- ============================================================
-- GreenDistrict — SQL объекты БД
-- Views, Functions, Stored Procedures, Triggers
-- ============================================================

-- ============================================================
-- VIEWS (представления)
-- ============================================================

-- 1. Активные заявки с информацией о пользователе и объекте
CREATE OR REPLACE VIEW view_active_reports AS
SELECT
  r.id,
  r.description,
  r."problemType",
  r.severity,
  r.status,
  r.address,
  r."photoUrl",
  r."aiAnalysis",
  r."createdAt",
  u.name AS user_name,
  u.email AS user_email,
  g.name AS object_name,
  g.type AS object_type
FROM reports r
LEFT JOIN users u ON r."userId" = u.id
LEFT JOIN green_objects g ON r."greenObjectId" = g.id
WHERE r.status IN ('new', 'in_progress')
ORDER BY r."createdAt" DESC;

-- 2. Статистика по типам проблем
CREATE OR REPLACE VIEW view_problem_statistics AS
SELECT
  "problemType" AS problem_type,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE status = 'resolved') AS resolved,
  COUNT(*) FILTER (WHERE status = 'new') AS new_reports,
  COUNT(*) FILTER (WHERE severity = 'critical') AS critical_count,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'resolved') / NULLIF(COUNT(*), 0), 1) AS resolution_rate
FROM reports
WHERE "problemType" IS NOT NULL
GROUP BY "problemType"
ORDER BY total DESC;

-- 3. Активность пользователей
CREATE OR REPLACE VIEW view_user_activity AS
SELECT
  u.id,
  u.name,
  u.email,
  u.role,
  COUNT(r.id) AS total_reports,
  COUNT(r.id) FILTER (WHERE r.status = 'resolved') AS resolved_reports,
  MAX(r."createdAt") AS last_report_date
FROM users u
LEFT JOIN reports r ON r."userId" = u.id
GROUP BY u.id, u.name, u.email, u.role
ORDER BY total_reports DESC;

-- 4. Состояние зелёных объектов с количеством заявок
CREATE OR REPLACE VIEW view_green_objects_health AS
SELECT
  g.id,
  g.name,
  g.type,
  g.address,
  g.status,
  COUNT(r.id) AS total_reports,
  COUNT(r.id) FILTER (WHERE r.status = 'new') AS open_reports,
  COUNT(r.id) FILTER (WHERE r.severity = 'critical') AS critical_reports
FROM green_objects g
LEFT JOIN reports r ON r."greenObjectId" = g.id
GROUP BY g.id, g.name, g.type, g.address, g.status;


-- ============================================================
-- FUNCTIONS (функции)
-- ============================================================

-- 1. Получить количество заявок пользователя
CREATE OR REPLACE FUNCTION get_user_report_count(p_user_id INT)
RETURNS INT AS $$
  SELECT COUNT(*)::INT FROM reports WHERE "userId" = p_user_id;
$$ LANGUAGE sql STABLE;

-- 2. Получить рейтинг серьёзности объекта (0-100)
CREATE OR REPLACE FUNCTION calculate_object_health_score(p_object_id INT)
RETURNS NUMERIC AS $$
DECLARE
  v_score NUMERIC := 100;
  v_critical INT;
  v_high INT;
  v_medium INT;
BEGIN
  SELECT
    COUNT(*) FILTER (WHERE severity = 'critical' AND status != 'resolved'),
    COUNT(*) FILTER (WHERE severity = 'high' AND status != 'resolved'),
    COUNT(*) FILTER (WHERE severity = 'medium' AND status != 'resolved')
  INTO v_critical, v_high, v_medium
  FROM reports
  WHERE "greenObjectId" = p_object_id;

  v_score := v_score - (v_critical * 30) - (v_high * 15) - (v_medium * 5);
  RETURN GREATEST(0, v_score);
END;
$$ LANGUAGE plpgsql STABLE;

-- 3. Получить топ проблемных адресов
CREATE OR REPLACE FUNCTION get_top_problem_addresses(p_limit INT DEFAULT 5)
RETURNS TABLE(address TEXT, report_count BIGINT) AS $$
  SELECT address, COUNT(*) AS report_count
  FROM reports
  WHERE address IS NOT NULL AND address != ''
  GROUP BY address
  ORDER BY report_count DESC
  LIMIT p_limit;
$$ LANGUAGE sql STABLE;


-- ============================================================
-- STORED PROCEDURES (хранимые процедуры)
-- ============================================================

-- 1. Обновить статус заявки с записью в историю
CREATE OR REPLACE PROCEDURE update_report_status(
  p_report_id INT,
  p_new_status VARCHAR,
  p_changed_by VARCHAR,
  p_comment TEXT DEFAULT NULL
)
LANGUAGE plpgsql AS $$
DECLARE
  v_old_status VARCHAR;
BEGIN
  SELECT status INTO v_old_status FROM reports WHERE id = p_report_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Заявка с id % не найдена', p_report_id;
  END IF;

  UPDATE reports SET status = p_new_status WHERE id = p_report_id;

  INSERT INTO report_history ("reportId", "oldStatus", "newStatus", comment, "changedBy")
  VALUES (p_report_id, v_old_status, p_new_status, p_comment, p_changed_by);
END;
$$;

-- 2. Автоматически обновить статус зелёного объекта на основе заявок
CREATE OR REPLACE PROCEDURE refresh_green_object_status(p_object_id INT)
LANGUAGE plpgsql AS $$
DECLARE
  v_critical INT;
  v_high INT;
  v_new_status VARCHAR;
BEGIN
  SELECT
    COUNT(*) FILTER (WHERE severity = 'critical' AND status != 'resolved'),
    COUNT(*) FILTER (WHERE severity = 'high' AND status != 'resolved')
  INTO v_critical, v_high
  FROM reports
  WHERE "greenObjectId" = p_object_id;

  IF v_critical > 0 THEN
    v_new_status := 'critical';
  ELSIF v_high > 0 THEN
    v_new_status := 'needs_attention';
  ELSE
    v_new_status := 'healthy';
  END IF;

  UPDATE green_objects SET status = v_new_status WHERE id = p_object_id;
END;
$$;

-- 3. Закрыть все заявки старше N дней без движения
CREATE OR REPLACE PROCEDURE close_stale_reports(p_days INT DEFAULT 30)
LANGUAGE plpgsql AS $$
DECLARE
  v_report RECORD;
BEGIN
  FOR v_report IN
    SELECT id FROM reports
    WHERE status = 'new'
      AND "createdAt" < NOW() - (p_days || ' days')::INTERVAL
  LOOP
    CALL update_report_status(v_report.id, 'rejected', 'system', 'Автоматически закрыто по истечении срока');
  END LOOP;
END;
$$;


-- ============================================================
-- TRIGGERS (триггеры)
-- ============================================================

-- 1. При создании заявки — автоматически записать в историю
CREATE OR REPLACE FUNCTION trg_report_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO report_history ("reportId", "newStatus", comment, "changedBy")
  VALUES (NEW.id, NEW.status, 'Заявка создана', 'system');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_report_insert ON reports;
CREATE TRIGGER trigger_report_insert
  AFTER INSERT ON reports
  FOR EACH ROW EXECUTE FUNCTION trg_report_insert();

-- 2. При изменении статуса заявки — обновить статус зелёного объекта
CREATE OR REPLACE FUNCTION trg_report_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW."greenObjectId" IS NOT NULL THEN
    CALL refresh_green_object_status(NEW."greenObjectId");
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_report_status_change ON reports;
CREATE TRIGGER trigger_report_status_change
  AFTER UPDATE OF status ON reports
  FOR EACH ROW EXECUTE FUNCTION trg_report_status_change();

-- 3. Запрет удаления пользователя с активными заявками
CREATE OR REPLACE FUNCTION trg_prevent_user_delete()
RETURNS TRIGGER AS $$
DECLARE
  v_count INT;
BEGIN
  SELECT COUNT(*) INTO v_count FROM reports
  WHERE "userId" = OLD.id AND status IN ('new', 'in_progress');

  IF v_count > 0 THEN
    RAISE EXCEPTION 'Нельзя удалить пользователя с % активными заявками', v_count;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_prevent_user_delete ON users;
CREATE TRIGGER trigger_prevent_user_delete
  BEFORE DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION trg_prevent_user_delete();
