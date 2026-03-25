-- ============================================================
-- NOTIFICACIONES TABLE — Run this in Supabase SQL Editor
-- ============================================================
CREATE TABLE IF NOT EXISTS notificaciones (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id  TEXT NOT NULL,
    tipo        TEXT NOT NULL,        -- 'mencion' | 'asignacion' | 'vencimiento' | 'workflow'
    mensaje     TEXT NOT NULL,
    link        TEXT,                 -- optional deep-link e.g. /dashboard/broker/xxx?tab=proyectos
    leida       BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Ver propias notificaciones"
ON notificaciones FOR SELECT
USING (usuario_id = auth.uid()::text);

CREATE POLICY "Actualizar propias notificaciones"
ON notificaciones FOR UPDATE
USING (usuario_id = auth.uid()::text);

CREATE POLICY "Insertar notificaciones (autenticado)"
ON notificaciones FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
