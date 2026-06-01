import './globals.css';
import NextAuthProvider from './providers/SessionProvider';

export const metadata = {
  title: 'Psikotes Online Indonesia',
  description: 'Platform tes psikologi online untuk rekrutmen dan assessment',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-50">
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
