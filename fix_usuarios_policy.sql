-- Corrección para permitir a Equipo/Admin guardar configuración en la cuenta del Broker.

DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Equipo puede actualizar el perfil del Broker" ON public.usuarios;

-- Esta política asume que cualquier usuario (`auth.uid()`) que tenga parent_id = al ID que se intenta modificar (o sea, es parte de su equipo), puede actualizar la fila.
-- O bien, si es el propio dueño de la fila.
CREATE POLICY "Gestión de perfil (Propio o Equipo)" ON public.usuarios
FOR UPDATE
USING (
    id = auth.uid() 
    OR id = (SELECT parent_id FROM public.usuarios WHERE id = auth.uid())
);
