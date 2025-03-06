// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Woolly Mammoth Pet",
  description: "Your virtual woolly mammoth companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}