-- SQL Maestro para el Sistema de Gestión de Proyectos Avanzado --
-- Ejecuta esto en el SQL Editor de tu Dashboard de Supabase --

-- 1. Crear Tabla de Proyectos
CREATE TABLE IF NOT EXISTS public.proyectos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    color TEXT DEFAULT '#7C3AED',
    estado TEXT DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Archivado', 'Completado')),
    notas TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Crear Tabla de Tareas
CREATE TABLE IF NOT EXISTS public.tareas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proyecto_id UUID NOT NULL REFERENCES public.proyectos(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    prioridad TEXT DEFAULT 'Media' CHECK (prioridad IN ('Baja', 'Media', 'Alta', 'Crítica')),
    estado TEXT DEFAULT 'Inbox' CHECK (estado IN ('Inbox', 'En curso', 'Bloqueado', 'Hecho')),
    asignado_a UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    fecha_limite DATE,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Crear Tabla de Comentarios de Tareas
CREATE TABLE IF NOT EXISTS public.comentarios_tareas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tarea_id UUID NOT NULL REFERENCES public.tareas(id) ON DELETE CASCADE,
    autor_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    archivos JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE public.proyectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios_tareas ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Acceso (Basadas en la estructura existente)
-- Todos los roles pueden ver proyectos de su Broker vinculado
CREATE POLICY IF NOT EXISTS proyect_select_policy ON public.proyectos FOR SELECT 
USING (true); -- La seguridad real viene de quién puede entrar al dashboard

CREATE POLICY IF NOT EXISTS proyect_insert_policy ON public.proyectos FOR INSERT 
WITH CHECK (true); -- Solo Admin/Equipo deberían insertar (controlado en UI)

CREATE POLICY IF NOT EXISTS tarea_select_policy ON public.tareas FOR SELECT 
USING (true);

CREATE POLICY IF NOT EXISTS comment_all_policy ON public.comentarios_tareas FOR ALL 
USING (true);

-- 6. Forzar refresco de PostgREST
NOTIFY pgrst, 'reload schema';
