import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

export async function GET(request) {
    try {
        // Obtenemos las credenciales desde el entorno
        const client_email = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
        const private_key = process.env.GOOGLE_DRIVE_PRIVATE_KEY;
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

        if (!client_email || !private_key || !folderId) {
            return NextResponse.json({ error: 'Faltan credenciales de Google Drive en el servidor' }, { status: 500 });
        }

        // Limpiamos los saltos de línea codificados que Vercel/Next podrían interpretar mal
        const formattedKey = private_key.replace(/\\n/g, '\n');

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email,
                private_key: formattedKey,
            },
            scopes: SCOPES,
        });

        // Generamos un token temporal para que el cliente (frontend) pueda subir el archivo directo
        const client = await auth.getClient();
        const token = await client.getAccessToken();

        return NextResponse.json({
            token: token.token,
            folderId: folderId
        });

    } catch (error) {
        console.error('Error obteniendo el token de Drive:', error);
        return NextResponse.json({ error: 'Error al comunicarse con Google API' }, { status: 500 });
    }
}
