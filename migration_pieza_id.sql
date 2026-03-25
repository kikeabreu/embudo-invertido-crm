-- migration_pieza_id.sql
-- Vincula las tareas de proyectos con su pieza de origen en el Banco

ALTER TABLE public.tareas 
ADD COLUMN IF NOT EXISTS pieza_id uuid REFERENCES public.piezas_banco(id) ON DELETE SET NULL;
