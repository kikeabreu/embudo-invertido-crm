-- =========================================================================
-- CREACIÓN DE LA TABLA 'broker_config' EN SUPABASE
-- =========================================================================

-- 1. Crear la tabla para guardar las palomitas y configuraciones
CREATE TABLE IF NOT EXISTS public.broker_config (
    broker_id UUID PRIMARY KEY REFERENCES public.usuarios(id) ON DELETE CASCADE,
    instalacion_checked JSONB DEFAULT '{}',
    onboarding_checked JSONB DEFAULT '{}',
    instalacion_schema JSONB,
    onboarding_schema JSONB,
    broker_vars JSONB DEFAULT '{}',
    vars_labels JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Habilitar la Seguridad por Filas (Row Level Security)
ALTER TABLE public.broker_config ENABLE ROW LEVEL SECURITY;

-- 3. Política de Lectura: Todos pueden leer (igual que el perfil de usuario)
DROP POLICY IF EXISTS "Lectura global de broker_config" ON public.broker_config;
CREATE POLICY "Lectura global de broker_config" ON public.broker_config
    FOR SELECT
    USING (true);

-- 4. Política de Creación (Insert): Permitir al Dueño inicializar su fila, y a los Admin/Equipo también en su nombre
DROP POLICY IF EXISTS "Creación de broker_config" ON public.broker_config;
CREATE POLICY "Creación de broker_config" ON public.broker_config
    FOR INSERT
    WITH CHECK (true);

-- 5. Política de Edición (Update): Solo Dueño, Equipo o Admin global
DROP POLICY IF EXISTS "Edición universal de broker_config" ON public.broker_config;
CREATE POLICY "Edición universal de broker_config" ON public.broker_config
    FOR UPDATE
    USING (
        broker_id = auth.uid() 
        OR broker_id = (SELECT parent_id FROM public.usuarios WHERE id = auth.uid())
        OR (SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'Admin'
    )
    WITH CHECK (
        broker_id = auth.uid() 
        OR broker_id = (SELECT parent_id FROM public.usuarios WHERE id = auth.uid())
        OR (SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'Admin'
    );

-- 6. Forzar la recarga del esquema en el servidor API de Supabase para quitar el error 'schema cache'
NOTIFY pgrst, 'reload schema';
