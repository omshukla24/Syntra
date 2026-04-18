import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import CursorGlow from "@/components/CursorGlow";

export const metadata: Metadata = {
  title: "Syntra — From Thought to System",
  description: "Syntra transforms messy human thoughts into structured, actionable systems. AI-powered productivity platform.",
  keywords: ["productivity", "task management", "AI", "planning", "focus"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main style={{
            flex: 1,
            marginLeft: 'var(--sidebar-width)',
            minHeight: '100vh',
            transition: 'margin-left 0.2s ease',
          }}>
            <CursorGlow>
              {children}
            </CursorGlow>
          </main>
        </div>
      </body>
    </html>
  );
}
