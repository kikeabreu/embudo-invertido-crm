-- SQL para actualizar los roles permitidos en la base de datos --
-- Ejecuta esto en el SQL Editor de tu Dashboard de Supabase --

-- 1. Eliminar la restricción antigua (si existe con ese nombre)
ALTER TABLE public.usuarios DROP CONSTRAINT IF EXISTS usuarios_rol_check;

-- 2. Crear la nueva restricción que incluye 'Equipo' y 'Coordinador'
ALTER TABLE public.usuarios 
ADD CONSTRAINT usuarios_rol_check 
CHECK (rol IN ('Admin', 'Broker', 'Equipo', 'Coordinador'));

-- Comentario: Esto ya permite que la base de datos acepte los nuevos tipos de cuenta.
