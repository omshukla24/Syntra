import type { Metadata } from "next";
import "./globals.css";
import ClientShell from "@/components/ClientShell";

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
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
