import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Map Dashboard - Urban GIS",
  description: "Interactive map dashboard for Ho Chi Minh City urban planning",
};

export default function MapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
