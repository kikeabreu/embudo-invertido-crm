import { createClient } from '@supabase/supabase-js';

// Esto usa la Service Role Key, que tiene permisos absolutos (ignora RLS)
// NUNCA EXPONGAS ESTA LLAVE AL CLIENTE (navegador). Solo se usa en el servidor.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
