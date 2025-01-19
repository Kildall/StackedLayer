import { Shield } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="border-b bg-white backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Shield className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-primary">StackedLayer</span>
          </Link>
          <Link
            href="https://github.com/stackedlayer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <SiGithub />
            View on GitHub
          </Link>
        </div>
      </div>
    </nav>
  );
};