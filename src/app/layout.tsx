import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gensar Admin",
  description: "Admin dashboard for Gensar website management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link rel="icon" href="/img/fav-icon.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/img/fav-icon-16.png" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="/img/fav-icon.png" />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
