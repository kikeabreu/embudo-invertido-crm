-- SQL para habilitar la función de DESHACER en el historial --
-- Ejecuta esto en el SQL Editor de tu Dashboard de Supabase --

-- 1. Agregar columna 'payload' a la tabla de logs para guardar el estado anterior
ALTER TABLE public.logs ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;

-- 2. Asegurarse de que el RLS permita lectura/escritura (ya debería estar)
-- 3. Forzar refresco de PostgREST
NOTIFY pgrst, 'reload schema';
