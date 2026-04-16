-- Schema para el módulo "Ads Tracker" dinámico
-- Tablas: ads_campaigns, ads_metrics

-- 1. Tabla de campañas de anuncios
CREATE TABLE IF NOT EXISTS public.ads_campaigns (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    broker_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE NOT NULL,
    nombre TEXT NOT NULL,
    config JSONB DEFAULT '{}'::jsonb NOT NULL,
    estado TEXT DEFAULT 'Activa' NOT NULL,
    presupuesto_mensual NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS: Mismos permisos que proyectos
ALTER TABLE public.ads_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ver campaigns propias o todo el equipo" ON public.ads_campaigns FOR SELECT USING (
    broker_id = auth.uid()
    OR broker_id IN (SELECT id FROM public.usuarios WHERE parent_id = auth.uid())
    OR (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('Admin', 'Equipo')
);
CREATE POLICY "Insertar campaigns propias o admin/equipo" ON public.ads_campaigns FOR INSERT WITH CHECK (
    broker_id = auth.uid()
    OR broker_id IN (SELECT id FROM public.usuarios WHERE parent_id = auth.uid())
    OR (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('Admin', 'Equipo')
);
CREATE POLICY "Actualizar campaigns propias o admin/equipo" ON public.ads_campaigns FOR UPDATE USING (
    broker_id = auth.uid()
    OR broker_id IN (SELECT id FROM public.usuarios WHERE parent_id = auth.uid())
    OR (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('Admin', 'Equipo')
);
CREATE POLICY "Eliminar campaigns admin/equipo" ON public.ads_campaigns FOR DELETE USING (
    (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('Admin', 'Equipo')
);

-- 2. Tabla de métricas diarias/registros
CREATE TABLE IF NOT EXISTS public.ads_metrics (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    campaign_id UUID REFERENCES public.ads_campaigns(id) ON DELETE CASCADE NOT NULL,
    fecha DATE NOT NULL,
    metrics JSONB DEFAULT '{}'::jsonb NOT NULL,
    creado_por UUID REFERENCES public.usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Para evitar duplicados de la misma campaña el mismo día (opcional, pero buena práctica)
CREATE UNIQUE INDEX IF NOT EXISTS ads_metrics_campaign_fecha_idx ON public.ads_metrics (campaign_id, fecha);

-- RLS para métricas
ALTER TABLE public.ads_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ver metrics de campañas asociadas" ON public.ads_metrics FOR SELECT USING (
    campaign_id IN (
        SELECT id FROM public.ads_campaigns WHERE broker_id = auth.uid()
        OR broker_id IN (SELECT id FROM public.usuarios WHERE parent_id = auth.uid())
        OR (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('Admin', 'Equipo')
    )
);
CREATE POLICY "Insertar metrics" ON public.ads_metrics FOR INSERT WITH CHECK (
    campaign_id IN (
        SELECT id FROM public.ads_campaigns WHERE broker_id = auth.uid()
        OR broker_id IN (SELECT id FROM public.usuarios WHERE parent_id = auth.uid())
        OR (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('Admin', 'Equipo')
    )
);
CREATE POLICY "Actualizar metrics" ON public.ads_metrics FOR UPDATE USING (
    campaign_id IN (
        SELECT id FROM public.ads_campaigns WHERE broker_id = auth.uid()
        OR broker_id IN (SELECT id FROM public.usuarios WHERE parent_id = auth.uid())
        OR (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('Admin', 'Equipo')
    )
);
CREATE POLICY "Eliminar metrics admin/equipo" ON public.ads_metrics FOR DELETE USING (
    (SELECT rol FROM public.usuarios WHERE id = auth.uid()) IN ('Admin', 'Equipo')
);

-- Funciones automáticas para updated_at (opcional)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_ads_campaigns_updated_at ON public.ads_campaigns;
CREATE TRIGGER update_ads_campaigns_updated_at
    BEFORE UPDATE ON public.ads_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ads_metrics_updated_at ON public.ads_metrics;
CREATE TRIGGER update_ads_metrics_updated_at
    BEFORE UPDATE ON public.ads_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
