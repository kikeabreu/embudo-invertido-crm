-- Script para crear las tablas necesarias en Supabase para el CRM Embudo Invertido

-- 1. Tabla de Usuarios / Brokers (Extiende la autenticación de Supabase)
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    rol TEXT DEFAULT 'Broker' CHECK (rol IN ('Admin', 'Broker')),
    fecha_corte DATE,
    precio_pactado NUMERIC(10, 2) DEFAULT 0.00,
    estado_pago TEXT DEFAULT 'Pendiente' CHECK (estado_pago IN ('Pagado', 'Pendiente', 'Atrasado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla de Piezas del Banco (Contenido generado)
CREATE TABLE IF NOT EXISTS public.piezas_banco (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    broker_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    fase TEXT CHECK (fase IN ('Atracción', 'Valor', 'Conversión')),
    avatar TEXT,
    dolor TEXT,
    titulo TEXT,
    hook TEXT,
    cuerpo TEXT,
    cta_dm TEXT,
    formato TEXT,
    estado TEXT DEFAULT 'En cola' CHECK (estado IN ('En cola', 'Producción', 'Aprobado', 'Programado', 'Publicado')),
    recursos_url TEXT,
    anotaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla de Logs / Historial de Actividad
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    broker_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    pieza_id UUID REFERENCES public.piezas_banco(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabla de Pagos / Recibos (Mini-ERP para el Admin)
CREATE TABLE IF NOT EXISTS public.pagos_recibos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    broker_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE NOT NULL,
    monto NUMERIC(10, 2) NOT NULL,
    fecha_pago DATE NOT NULL,
    comprobante_url TEXT,
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.piezas_banco ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos_recibos ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad (RLS)

-- Los usuarios pueden leer su propio perfil y el Admin puede leer todos
CREATE POLICY "Usuarios leen su perfil y Admin lee todos" ON public.usuarios
    FOR SELECT USING (auth.uid() = id OR (SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'Admin');

-- El Admin puede insertar/actualizar cualquier usuario
CREATE POLICY "Admin gestiona usuarios" ON public.usuarios
    FOR ALL USING ((SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'Admin');

-- Brokers ven/editan solo sus piezas
CREATE POLICY "Brokers gestionan sus piezas" ON public.piezas_banco
    FOR ALL USING (broker_id = auth.uid() OR (SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'Admin');

-- Los logs son visibles por el broker dueño y el Admin
CREATE POLICY "Lectura de logs por dueño y Admin" ON public.logs
    FOR SELECT USING (broker_id = auth.uid() OR (SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'Admin');

-- Los logs se pueden insertar
CREATE POLICY "Inserción de logs permitida" ON public.logs
    FOR INSERT WITH CHECK (broker_id = auth.uid() OR (SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'Admin');

-- Pagos solo visibles y gestionables por Admin
CREATE POLICY "Admin gestiona pagos" ON public.pagos_recibos
    FOR ALL USING ((SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'Admin');
