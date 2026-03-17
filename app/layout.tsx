// app/layout.tsx
import "./globals.css"; // ต้องมีบรรทัดนี้เพื่อให้ Tailwind ทำงาน
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={`${inter.className} antialiased bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}