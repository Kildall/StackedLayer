'use client';
import { Footer } from "./Footer";
import { Navbar } from "@/components/layout/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
      <Navbar />
      <main className="flex-grow max-w-7xl w-full mx-auto overflow-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
};