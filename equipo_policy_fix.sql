-- RUN THIS IN SUPABASE SQL EDITOR --

-- Delete old policy
DROP POLICY IF EXISTS "Brokers gestionan sus piezas" ON public.piezas_banco;

-- Create new policy that allows Admin, the specific Broker, AND any 'Equipo' user
CREATE POLICY "Gestión de piezas (Broker, Admin, Equipo)" ON public.piezas_banco
    FOR ALL USING (
        broker_id = auth.uid() 
        OR (SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'Admin'
        OR (SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'Equipo'
    );
