-- SQL para agregar columnas faltantes a la tabla piezas_banco --
-- Ejecuta esto en el SQL Editor de tu Dashboard de Supabase --

ALTER TABLE public.piezas_banco 
ADD COLUMN IF NOT EXISTS guion TEXT,
ADD COLUMN IF NOT EXISTS instrucciones TEXT,
ADD COLUMN IF NOT EXISTS notas_internas TEXT,
ADD COLUMN IF NOT EXISTS link_final TEXT,
ADD COLUMN IF NOT EXISTS avatar TEXT,
ADD COLUMN IF NOT EXISTS dolor TEXT,
ADD COLUMN IF NOT EXISTS cta_dm TEXT;

-- Nota: Algunas columnas como 'avatar' o 'dolor' podrían ya existir, 
-- ADD COLUMN IF NOT EXISTS se encargará de no duplicarlas.
