-- SQL para arreglar la columna 'num' faltante --
-- Ejecuta esto en el SQL Editor de tu Dashboard de Supabase --

-- 1. Agregar la columna 'num' si no existe
ALTER TABLE public.piezas_banco ADD COLUMN IF NOT EXISTS num INT;

-- 2. Asegurarse de que las piezas actuales tengan un número (opcional pero recomendado)
-- UPDATE public.piezas_banco SET num = 1 WHERE num IS NULL;

-- 3. Notificar a Supabase que recargue el esquema (por si acaso)
NOTIFY pgrst, 'reload schema';

-- Nota: Esto resolverá el error "Could not find the 'num' column' que da el importador masivo.
