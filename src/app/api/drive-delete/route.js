import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request) {
    try {
        const body = await request.json();
        const { fileId } = body;

        if (!fileId) {
            return NextResponse.json({ error: 'Falta el fileId' }, { status: 400 });
        }

        const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
        const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

        if (!clientId || !clientSecret || !refreshToken) {
            return NextResponse.json({ error: 'Credenciales incompletas en el servidor' }, { status: 500 });
        }

        const oauth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
            "https://developers.google.com/oauthplayground"
        );

        oauth2Client.setCredentials({ refresh_token: refreshToken });

        const drive = google.drive({ version: 'v3', auth: oauth2Client });

        await drive.files.delete({ fileId });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error al borrar el archivo en Drive:', error);
        return NextResponse.json({ error: 'Error al comunicarse con Google API' }, { status: 500 });
    }
}
