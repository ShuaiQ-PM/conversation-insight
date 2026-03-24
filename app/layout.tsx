import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Linear Style Starter",
  description: "Next.js + shadcn/ui light theme starter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
