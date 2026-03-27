-- FIX DE POLITICAS PARA 'broker_config' EN LUGAR DE 'usuarios'

DROP POLICY IF EXISTS "Lectura global de broker_config" ON public.broker_config;
DROP POLICY IF EXISTS "Edición universal de broker_config" ON public.broker_config;

-- 1. Leer: Todos pueden leer (igual que usuarios)
CREATE POLICY "Lectura global de broker_config" ON public.broker_config
FOR SELECT
USING (true);

-- 2. Update: Admin, Dueño, o Equipo
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
