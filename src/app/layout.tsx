import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navigation } from "@/components/Navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Incident Manager",
  description: "Gestion des incidents et plans de continuité d'activité",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          {session ? (
            <div className="min-h-screen flex">
              {/* Fixed Navigation Sidebar */}
              <aside className="fixed top-0 left-0 z-40 h-screen w-64">
                <div className="h-full bg-gray-900 border-r border-gray-800">
                  <Navigation />
                </div>
              </aside>

              {/* Main Content */}
              <main className="flex-1 ml-64 bg-gray-800 min-h-screen">
                <div className="p-8">
                  {children}
                </div>
              </main>
            </div>
          ) : (
            <main className="min-h-screen bg-gray-50">
              {children}
            </main>
          )}
        </Providers>
      </body>
    </html>
  );
}
