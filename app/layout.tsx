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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const savedDarkMode = localStorage.getItem('darkMode');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const isDark = savedDarkMode === 'true' || (savedDarkMode === null && prefersDark);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
