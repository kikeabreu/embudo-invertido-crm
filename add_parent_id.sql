-- SQL para agregar relación de Coordinador a Broker --
-- Ejecuta esto en el SQL Editor de tu Dashboard de Supabase --

ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL;

-- Comentario: El parent_id servirá para que un Coordinador esté vinculado a un Broker específico.
