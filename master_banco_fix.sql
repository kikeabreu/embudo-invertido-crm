-- SQL Maestro para Sincronizar la Tabla Piezas de Banco --
-- Ejecuta esto en el SQL Editor de tu Dashboard de Supabase --

-- 1. Asegurar que las columnas básicas y extras existan
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS num INT;
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS fase TEXT DEFAULT 'Atracción';
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'En cola';
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS titulo TEXT;
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS hook TEXT;
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS cuerpo TEXT;
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS dolor TEXT;
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS cta_dm TEXT;
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS recursos_url TEXT;
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS link_final TEXT;
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS link_evidencia TEXT;
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS fecha_prog DATE;
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS formato TEXT;
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS origen TEXT DEFAULT 'manual';
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS origen_ref UUID;
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS guion TEXT;
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS instrucciones TEXT;
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS notas_internas TEXT;
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS anotaciones JSONB DEFAULT '[]';

-- 2. Actualizar Restricciones (Check Constraints) para que acepten los nombres actuales
ALTER TABLE public.piezas_banco DROP CONSTRAINT IF EXISTS piezas_banco_fase_check;
ALTER TABLE public.piezas_banco ADD CONSTRAINT piezas_banco_fase_check 
CHECK (fase IN ('Atracción', 'Valor', 'Conversión', 'Adoctrinamiento', 'Venta'));

ALTER TABLE public.piezas_banco DROP CONSTRAINT IF EXISTS piezas_banco_estado_check;
ALTER TABLE public.piezas_banco ADD CONSTRAINT piezas_banco_estado_check 
CHECK (estado IN ('En cola', 'Producción', 'Aprobado', 'Programado', 'Publicado', 'Revisar'));

-- 3. Limpiar nulos en columnas con default (opcional)
UPDATE public.piezas_banco SET fase = 'Atracción' WHERE fase IS NULL;
UPDATE public.piezas_banco SET estado = 'En cola' WHERE estado IS NULL;
UPDATE public.piezas_banco SET origen = 'manual' WHERE origen IS NULL;
UPDATE public.piezas_banco SET anotaciones = '[]' WHERE anotaciones IS NULL;

-- 3. Forzar refresco de PostgREST
NOTIFY pgrst, 'reload schema';

-- Mensaje: Esto habilitará todas las funciones nuevas del CRM incluyendo la importación masiva.
