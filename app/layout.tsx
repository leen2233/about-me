import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";
import "./highlight.css";
import TabBar from "./components/TabBar";
import Sidebar from "./components/Sidebar";
import StatusBar from "./components/StatusBar";
import { getFileTree } from "./lib/tree";

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
        <div className="flex flex-col h-screen overflow-hidden">
          {/* Tab Bar */}
          <TabBar />

          {/* Main Content Area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar fileTree={fileTree} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
              <div className="p-5 max-w-none">
                {children}
              </div>
            </main>
          </div>

          {/* Status Bar */}
          <StatusBar />
        </div>
      </body>
    </html>
  );
}
