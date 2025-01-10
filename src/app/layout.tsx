// src/app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Riyadh Mother of all Maps',
  description: 'This is the mother of all maps for Riyadh',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

