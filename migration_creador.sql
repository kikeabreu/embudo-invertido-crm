-- migration_creador.sql
-- Agrega la columna 'creador_id' a la tabla 'tareas' para registrar quién detonó el botón de la maquila

ALTER TABLE public.tareas 
ADD COLUMN IF NOT EXISTS creador_id uuid REFERENCES public.usuarios(id) ON DELETE SET NULL;
