-- REPARACIÓN NUCLEAR DE POLÍTICAS DE 'USUARIOS'

-- 1. Borrar todas las políticas previas de SELECT o UPDATE en 'usuarios' para evitar conflictos
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Equipo puede ver perfiles" ON public.usuarios;
DROP POLICY IF EXISTS "Gestión de perfil (Propio o Equipo)" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Equipo puede actualizar el perfil del Broker" ON public.usuarios;
DROP POLICY IF EXISTS "Actualizar perfil y variables (Admin, Dueño, Equipo)" ON public.usuarios;

-- 2. Asegurarnos que todo mundo pueda LEER todos los perfiles, o al menos el suyo propio 
-- (Necesario para poder comprobar el 'rol' de Admin internamente)
CREATE POLICY "Lectura global de usuarios" ON public.usuarios
FOR SELECT
USING (true);

-- 3. La política de UPDATE definitiva.
-- Te deja editar si eres el Dueño, si eres de su Equipo, o si tienes Rol de Admin.
CREATE POLICY "Edición universal (Admin, Dueño, Equipo)" ON public.usuarios
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
