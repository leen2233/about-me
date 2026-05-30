import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";
import "./highlight.css";
import TabBar from "./components/TabBar";
import Sidebar from "./components/Sidebar";
import StatusBar from "./components/StatusBar";
import { getFileTree } from "./lib/tree";
import SidebarToggle from "./components/SidebarToggle";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Personal Blog - Neovim Theme",
  description: "A personal blogging website with Neovim design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fileTree = getFileTree();

  return (
    <html lang="en">
      <body className={`${firaCode.variable} antialiased`}>
        <SidebarToggle>
          <TabBar />

          <div className="flex flex-1 overflow-hidden">
            <Sidebar fileTree={fileTree} />

            <main className="flex-1 overflow-y-auto">
              <div className="p-3 sm:p-5 max-w-none">
                {children}
              </div>
            </main>
          </div>

          <StatusBar />
        </SidebarToggle>
      </body>
    </html>
  );
}
