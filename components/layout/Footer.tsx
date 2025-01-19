import { Shield } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";

export const Footer = () => {
  return (
    <footer className="border-t bg-white backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-primary">StackedLayer</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              End-to-end encrypted file and secret sharing made simple.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Security</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>End-to-end encryption</li>
              <li>One-time access</li>
              <li>Automatic deletion</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/stackedlayer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <SiGithub />
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms and Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground bg-white/50 backdrop-blur-sm">
          <p>&copy; {new Date().getFullYear()} StackedLayer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};