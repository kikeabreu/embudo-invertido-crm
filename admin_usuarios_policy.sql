-- CORRECCIÓN FINAL DE SEGURIDAD PARA ADMINISTRADORES Y EQUIPO

-- Borramos las políticas anteriores que haya para Update
DROP POLICY IF EXISTS "Gestión de perfil (Propio o Equipo)" ON public.usuarios;

-- Creamos la política definitiva que permite el UPDATE si:
-- 1. Eres el dueño de la fila (tu propio perfil)
-- 2. La fila pertenece a tu "Padre" (eres de su equipo)
-- 3. Eres un "Admin" (Superusuario del CRM, puedes editar a cualquier Broker)
CREATE POLICY "Actualizar perfil y variables (Admin, Dueño, Equipo)" ON public.usuarios
FOR UPDATE
USING (
    id = auth.uid() 
    OR id = (SELECT parent_id FROM public.usuarios WHERE id = auth.uid())
    OR (SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'Admin'
)
WITH CHECK (
    id = auth.uid() 
    OR id = (SELECT parent_id FROM public.usuarios WHERE id = auth.uid())
    OR (SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'Admin'
);
