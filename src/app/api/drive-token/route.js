import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

export async function GET(request) {
    try {
        const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
        const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

        if (!clientId || !clientSecret || !refreshToken || !folderId) {
            return NextResponse.json({ error: 'Faltan credenciales OAuth2 de Google Drive en el servidor' }, { status: 500 });
        }

        const oauth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
            "https://developers.google.com/oauthplayground" // Redirect URI
        );

        oauth2Client.setCredentials({
            refresh_token: refreshToken
        });

        const { token } = await oauth2Client.getAccessToken();

        return NextResponse.json({
            token: token,
            folderId: folderId
        });

    } catch (error) {
        console.error('Error obteniendo el token OAuth2 de Drive:', error);
        return NextResponse.json({ error: 'Error al comunicarse con Google API' }, { status: 500 });
    }
}
