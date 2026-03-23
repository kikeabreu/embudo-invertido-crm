-- SQL para permitir que los Coordinadores vean las piezas de su Broker vinculado --
-- Ejecuta esto en el SQL Editor de tu Dashboard de Supabase --

-- 1. Eliminar la política anterior
DROP POLICY IF EXISTS "Gestión de piezas (Broker, Admin, Equipo)" ON public.piezas_banco;

-- 2. Crear nueva política que incluye al Coordinador
CREATE POLICY "Gestión de piezas (Broker, Admin, Equipo, Coordinador)" ON public.piezas_banco
    FOR ALL USING (
        broker_id = auth.uid() 
        OR (SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'Admin'
        OR (SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'Equipo'
        OR (SELECT parent_id FROM public.usuarios WHERE id = auth.uid()) = broker_id
    );

-- Notas: Con esto, si un usuario es Coordinador y su parent_id coincide con el broker_id de la pieza, tendrá acceso total.
