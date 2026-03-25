-- ============================================================
-- MIGRATION: Fix tareas table for workflow buttons + notificaciones
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Add broker_id column to tareas (for workflow actions that don't have a project yet)
ALTER TABLE public.tareas ADD COLUMN IF NOT EXISTS broker_id UUID;

-- 2. Make proyecto_id nullable (workflow tasks are created without a project)
ALTER TABLE public.tareas ALTER COLUMN proyecto_id DROP NOT NULL;

-- 3. Fix estado check constraint to accept lowercase values
ALTER TABLE public.tareas DROP CONSTRAINT IF EXISTS tareas_estado_check;
ALTER TABLE public.tareas ADD CONSTRAINT tareas_estado_check 
    CHECK (estado IN ('Inbox', 'inbox', 'En curso', 'en_curso', 'Bloqueado', 'bloqueado', 'Hecho', 'hecho'));

-- 4. Add missing INSERT/UPDATE policies on tareas
CREATE POLICY IF NOT EXISTS tarea_insert_policy ON public.tareas FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS tarea_update_policy ON public.tareas FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS tarea_delete_policy ON public.tareas FOR DELETE USING (true);

-- 5. Create the notificaciones table
CREATE TABLE IF NOT EXISTS public.notificaciones (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id  TEXT NOT NULL,
    tipo        TEXT NOT NULL,
    mensaje     TEXT NOT NULL,
    link        TEXT,
    leida       BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notificaciones ENABLE ROW LEVEL SECURITY;

-- Políticas de notificaciones
CREATE POLICY IF NOT EXISTS notif_select ON public.notificaciones FOR SELECT
USING (usuario_id = auth.uid()::text);

CREATE POLICY IF NOT EXISTS notif_update ON public.notificaciones FOR UPDATE
USING (usuario_id = auth.uid()::text);

CREATE POLICY IF NOT EXISTS notif_insert ON public.notificaciones FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- 6. Reload schema
NOTIFY pgrst, 'reload schema';
