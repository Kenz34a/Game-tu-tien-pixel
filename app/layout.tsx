import type { Metadata } from "next";
import "./globals.css";
import "./pixel-ui.css";
import "./rpg.css";
import "./immortal-ui.css";
import "./combat-ui.css";

export const metadata: Metadata = {
  title: "Vân Thiên Ký · Tu tiên pixel MMORPG",
  description: "Khám phá Thanh Vân Môn, săn yêu thú, tu luyện và đột phá cảnh giới cùng đạo hữu.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
