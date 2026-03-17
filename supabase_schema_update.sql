-- Add JSONB columns for config and tracking to usuarios
ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS instalacion_checked JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS onboarding_checked JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS broker_vars JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS secuencias_data JSONB DEFAULT '{"ciclos": [], "activoCicloId": null}'::jsonb;
