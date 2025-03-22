import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Horama Stripe test",
  description: "Stripe action",
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
