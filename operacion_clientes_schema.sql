-- OPERACION POR CLIENTE, CICLOS CONTRACTUALES Y CARTERA DE EDITORES
-- Se puede ejecutar más de una vez sin duplicar datos.

BEGIN;

ALTER TABLE public.usuarios
    ADD COLUMN IF NOT EXISTS fecha_contratacion DATE,
    ADD COLUMN IF NOT EXISTS piezas_comprometidas INTEGER DEFAULT 12,
    ADD COLUMN IF NOT EXISTS proxima_accion TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS notas_operativas TEXT DEFAULT '';

UPDATE public.usuarios
SET fecha_contratacion = COALESCE(fecha_contratacion, fecha_corte, created_at::date)
WHERE rol = 'Broker' AND fecha_contratacion IS NULL;

UPDATE public.usuarios
SET piezas_comprometidas = 12
WHERE rol = 'Broker' AND piezas_comprometidas IS NULL;

ALTER TABLE public.usuarios
    DROP CONSTRAINT IF EXISTS usuarios_piezas_comprometidas_check;
ALTER TABLE public.usuarios
    ADD CONSTRAINT usuarios_piezas_comprometidas_check
    CHECK (piezas_comprometidas >= 0);

CREATE TABLE IF NOT EXISTS public.editor_clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    editor_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    broker_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (editor_id, broker_id)
);

CREATE INDEX IF NOT EXISTS editor_clientes_editor_idx ON public.editor_clientes(editor_id);
CREATE INDEX IF NOT EXISTS editor_clientes_broker_idx ON public.editor_clientes(broker_id);

ALTER TABLE public.piezas_banco
    ADD COLUMN IF NOT EXISTS fecha_publicada DATE;

UPDATE public.piezas_banco
SET fecha_publicada = COALESCE(fecha_publicada, fecha_prog, updated_at::date, created_at::date)
WHERE estado = 'Publicado' AND fecha_publicada IS NULL;

CREATE OR REPLACE FUNCTION public.set_fecha_publicada()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.estado = 'Publicado' AND NEW.fecha_publicada IS NULL THEN
        NEW.fecha_publicada = COALESCE(NEW.fecha_prog, CURRENT_DATE);
    ELSIF NEW.estado <> 'Publicado' THEN
        NEW.fecha_publicada = NULL;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS piezas_set_fecha_publicada ON public.piezas_banco;
CREATE TRIGGER piezas_set_fecha_publicada
BEFORE INSERT OR UPDATE OF estado, fecha_prog ON public.piezas_banco
FOR EACH ROW EXECUTE FUNCTION public.set_fecha_publicada();

CREATE OR REPLACE FUNCTION public.crm_current_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT rol FROM public.usuarios WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.crm_current_parent_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT parent_id FROM public.usuarios WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.crm_can_access_broker(target_broker UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT
        auth.uid() = target_broker
        OR public.crm_current_role() = 'Admin'
        OR public.crm_current_parent_id() = target_broker
        OR EXISTS (
            SELECT 1 FROM public.editor_clientes
            WHERE editor_id = auth.uid() AND broker_id = target_broker
        );
$$;

CREATE OR REPLACE FUNCTION public.crm_can_operate_broker(target_broker UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT
        public.crm_current_role() = 'Admin'
        OR EXISTS (
            SELECT 1 FROM public.editor_clientes
            WHERE editor_id = auth.uid() AND broker_id = target_broker
        );
$$;

REVOKE ALL ON FUNCTION public.crm_current_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.crm_current_parent_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.crm_can_access_broker(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.crm_can_operate_broker(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.crm_current_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_current_parent_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_can_access_broker(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_can_operate_broker(UUID) TO authenticated;

ALTER TABLE public.editor_clientes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Administrar asignaciones de editores" ON public.editor_clientes;
DROP POLICY IF EXISTS "Editor consulta su cartera" ON public.editor_clientes;
CREATE POLICY "Administrar asignaciones de editores" ON public.editor_clientes
FOR ALL TO authenticated
USING (public.crm_current_role() = 'Admin')
WITH CHECK (public.crm_current_role() = 'Admin');
CREATE POLICY "Editor consulta su cartera" ON public.editor_clientes
FOR SELECT TO authenticated
USING (editor_id = auth.uid());

-- Perfiles: cada persona ve su perfil; Admin ve todos; Editor ve sus clientes.
DROP POLICY IF EXISTS "Lectura global de usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios leen su perfil y Admin lee todos" ON public.usuarios;
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Equipo puede ver perfiles" ON public.usuarios;
DROP POLICY IF EXISTS "Gestión de perfil (Propio o Equipo)" ON public.usuarios;
DROP POLICY IF EXISTS "Actualizar perfil y variables (Admin, Dueño, Equipo)" ON public.usuarios;
DROP POLICY IF EXISTS "Edición universal (Admin, Dueño, Equipo)" ON public.usuarios;
DROP POLICY IF EXISTS "Perfiles por cartera operativa" ON public.usuarios;
DROP POLICY IF EXISTS "Admin actualiza perfiles operativos" ON public.usuarios;
CREATE POLICY "Perfiles por cartera operativa" ON public.usuarios
FOR SELECT TO authenticated
USING (
    id = auth.uid()
    OR public.crm_current_role() = 'Admin'
    OR id = public.crm_current_parent_id()
    OR (rol = 'Broker' AND public.crm_can_access_broker(id))
);
CREATE POLICY "Admin actualiza perfiles operativos" ON public.usuarios
FOR UPDATE TO authenticated
USING (public.crm_current_role() = 'Admin')
WITH CHECK (public.crm_current_role() = 'Admin');

-- Banco: lectura por cartera. Admin y editor asignado operan; cliente conserva comentarios/aprobación.
DROP POLICY IF EXISTS "Brokers gestionan sus piezas" ON public.piezas_banco;
DROP POLICY IF EXISTS "Gestión de piezas (Broker, Admin, Equipo)" ON public.piezas_banco;
DROP POLICY IF EXISTS "Gestión de piezas (Broker, Admin, Equipo, Coordinador)" ON public.piezas_banco;
DROP POLICY IF EXISTS "Piezas visibles por cartera" ON public.piezas_banco;
DROP POLICY IF EXISTS "Piezas operables por cartera" ON public.piezas_banco;
CREATE POLICY "Piezas visibles por cartera" ON public.piezas_banco
FOR SELECT TO authenticated
USING (public.crm_can_access_broker(broker_id));
CREATE POLICY "Piezas operables por cartera" ON public.piezas_banco
FOR ALL TO authenticated
USING (
    public.crm_can_operate_broker(broker_id)
    OR auth.uid() = broker_id
    OR public.crm_current_parent_id() = broker_id
)
WITH CHECK (
    public.crm_can_operate_broker(broker_id)
    OR auth.uid() = broker_id
    OR public.crm_current_parent_id() = broker_id
);

-- Proyectos y tareas dejan de ser globales para el Equipo.
ALTER TABLE public.proyectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tareas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS proyect_select_policy ON public.proyectos;
DROP POLICY IF EXISTS proyect_insert_policy ON public.proyectos;
DROP POLICY IF EXISTS "Proyectos por cartera" ON public.proyectos;
DROP POLICY IF EXISTS "Operar proyectos por cartera" ON public.proyectos;
CREATE POLICY "Proyectos por cartera" ON public.proyectos
FOR SELECT TO authenticated
USING (public.crm_can_access_broker(broker_id));
CREATE POLICY "Operar proyectos por cartera" ON public.proyectos
FOR ALL TO authenticated
USING (public.crm_can_operate_broker(broker_id))
WITH CHECK (public.crm_can_operate_broker(broker_id));

DROP POLICY IF EXISTS tarea_select_policy ON public.tareas;
DROP POLICY IF EXISTS tarea_insert_policy ON public.tareas;
DROP POLICY IF EXISTS tarea_update_policy ON public.tareas;
DROP POLICY IF EXISTS tarea_delete_policy ON public.tareas;
DROP POLICY IF EXISTS "Tareas por cartera" ON public.tareas;
DROP POLICY IF EXISTS "Operar tareas por cartera" ON public.tareas;
CREATE POLICY "Tareas por cartera" ON public.tareas
FOR SELECT TO authenticated
USING (
    public.crm_can_access_broker(
        COALESCE(broker_id, (SELECT proyecto.broker_id FROM public.proyectos proyecto WHERE proyecto.id = proyecto_id))
    )
);
CREATE POLICY "Operar tareas por cartera" ON public.tareas
FOR ALL TO authenticated
USING (
    public.crm_can_operate_broker(
        COALESCE(broker_id, (SELECT proyecto.broker_id FROM public.proyectos proyecto WHERE proyecto.id = proyecto_id))
    )
)
WITH CHECK (
    public.crm_can_operate_broker(
        COALESCE(broker_id, (SELECT proyecto.broker_id FROM public.proyectos proyecto WHERE proyecto.id = proyecto_id))
    )
);

ALTER TABLE public.comentarios_tareas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS comment_all_policy ON public.comentarios_tareas;
DROP POLICY IF EXISTS "Comentarios de tareas visibles por cartera" ON public.comentarios_tareas;
DROP POLICY IF EXISTS "Crear comentarios en tareas visibles" ON public.comentarios_tareas;
DROP POLICY IF EXISTS "Gestionar comentarios propios" ON public.comentarios_tareas;
CREATE POLICY "Comentarios de tareas visibles por cartera" ON public.comentarios_tareas
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.tareas tarea WHERE tarea.id = tarea_id));
CREATE POLICY "Crear comentarios en tareas visibles" ON public.comentarios_tareas
FOR INSERT TO authenticated
WITH CHECK (
    autor_id = auth.uid()
    AND EXISTS (SELECT 1 FROM public.tareas tarea WHERE tarea.id = tarea_id)
);
CREATE POLICY "Gestionar comentarios propios" ON public.comentarios_tareas
FOR UPDATE TO authenticated
USING (autor_id = auth.uid() OR public.crm_current_role() = 'Admin')
WITH CHECK (autor_id = auth.uid() OR public.crm_current_role() = 'Admin');

ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura de logs por dueño y Admin" ON public.logs;
DROP POLICY IF EXISTS "Inserción de logs permitida" ON public.logs;
DROP POLICY IF EXISTS "Logs visibles por cartera" ON public.logs;
DROP POLICY IF EXISTS "Crear logs por cartera" ON public.logs;
CREATE POLICY "Logs visibles por cartera" ON public.logs
FOR SELECT TO authenticated
USING (public.crm_can_access_broker(broker_id));
CREATE POLICY "Crear logs por cartera" ON public.logs
FOR INSERT TO authenticated
WITH CHECK (public.crm_can_access_broker(broker_id));

NOTIFY pgrst, 'reload schema';
COMMIT;
