'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

export async function createBrokerAction(formData) {
    const nombre = formData.get('nombre');
    const email = formData.get('email');
    const password = formData.get('password');
    const precio = formData.get('precio_pactado');
    const corte = formData.get('fecha_corte');

    if (!email || !password || !nombre) {
        return { error: 'Faltan campos obligatorios' };
    }

    try {
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return { error: 'Falta la variable de entorno SUPABASE_SERVICE_ROLE_KEY' };
        }

        // 1. Crear el usuario en Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });

        if (authError) {
            return { error: authError.message };
        }

        const newUserId = authData.user.id;

        // 2. Insertar en tabla usuarios
        const { error: dbError } = await supabaseAdmin.from('usuarios').insert({
            id: newUserId,
            nombre,
            email,
            rol: 'Broker',
            precio_pactado: parseFloat(precio) || 0.00,
            fecha_corte: corte || null,
            estado_pago: 'Pendiente'
        });

        if (dbError) {
            // Rollback auth si falla la bd
            await supabaseAdmin.auth.admin.deleteUser(newUserId);
            return { error: 'Error al guardar perfil: ' + dbError.message };
        }

        revalidatePath('/dashboard');
        return { success: true, message: 'Broker creado exitosamente' };

    } catch (e) {
        return { error: 'Error inesperado del servidor: ' + e.message };
    }
}

export async function deleteBrokerAction(userId) {
    if (!userId) return { error: 'No se proveyó ID' };

    try {
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return { error: 'Falta la variable de entorno SUPABASE_SERVICE_ROLE_KEY' };
        }

        // Al borrar el usuario de Auth, Supabase lo borra de `usuarios` por la relación de la llave foránea
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (error) {
            return { error: error.message };
        }

        revalidatePath('/dashboard');
        return { success: true, message: 'Broker eliminado exitosamente' };

    } catch (e) {
        return { error: 'Error inesperado: ' + e.message };
    }
}
