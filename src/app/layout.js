import "./globals.css";

export const metadata = {
    title: "Embudo Invertido CRM",
    description: "Sistema Avanzado de Gestión para Agencias Top Seller",
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body className="antialiased">{children}</body>
        </html>
    );
}
