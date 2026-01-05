import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gold Star Man - Turn Goals into Daily Wins",
  description: "A simple goal setting and daily tracking app focused on yearly goals and weekly consistency.",
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
