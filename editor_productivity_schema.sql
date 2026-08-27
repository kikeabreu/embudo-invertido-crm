-- 1. Añadir columnas de seguimiento a la tabla 'tareas'
ALTER TABLE public.tareas 
ADD COLUMN IF NOT EXISTS fecha_inicio TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS fecha_fin TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS puntos_esfuerzo INTEGER DEFAULT 1;

-- 2. Función para registrar automáticamente los tiempos según el estado
CREATE OR REPLACE FUNCTION update_task_tracking_dates()
RETURNS TRIGGER AS $$
BEGIN
    -- Si el estado cambia a 'Edición' (o equivalente activo) y no tenía fecha de inicio
    IF NEW.estado IN ('Edición', 'En curso') AND (OLD.estado NOT IN ('Edición', 'En curso') OR OLD.estado IS NULL) THEN
        IF NEW.fecha_inicio IS NULL THEN
            NEW.fecha_inicio = now();
        END IF;
        -- Reseteamos fecha_fin si vuelve a edición después de un rechazo
        NEW.fecha_fin = NULL;
    END IF;

    -- Si el estado cambia a 'Revisión Cliente' o 'Hecho' o 'Aprobado'
    IF NEW.estado IN ('Revisión Cliente', 'Hecho', 'Aprobado') AND (OLD.estado NOT IN ('Revisión Cliente', 'Hecho', 'Aprobado') OR OLD.estado IS NULL) THEN
        IF NEW.fecha_fin IS NULL THEN
            NEW.fecha_fin = now();
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Crear el Trigger
DROP TRIGGER IF EXISTS task_tracking_trigger ON public.tareas;
CREATE TRIGGER task_tracking_trigger
BEFORE UPDATE ON public.tareas
FOR EACH ROW
EXECUTE FUNCTION update_task_tracking_dates();

-- 4. Notificar a PostgREST para que refresque el esquema y la API reconozca las nuevas columnas
NOTIFY pgrst, 'reload schema';
