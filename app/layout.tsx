// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Chonky Mammoth",
  description: "Raise your own Chonky Mammoth companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}