import { useState, useEffect } from "react";
import type { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileNavbarProps {
  currentPath: string;
}

export const MobileNavbar: FC<MobileNavbarProps> = ({ currentPath }) => {
  const [ignoreRender, setIgnoreRender] = useState<Array<{ name: 'login' | 'signup', path: string }>>([]);

  useEffect(() => {
    switch (currentPath) {
      case "/login":
        setIgnoreRender([{ name: "login", path: "/login" }]);
        break;
      default:
        setIgnoreRender([]);
    }
  }, [currentPath]);

  return (
    <div className="flex md:hidden mx-2 items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5 rotate-0 scale-100" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-screen p-4 font-medium">
          <DropdownMenuItem>
            <a href="/">Home</a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a href="/#features">Features</a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a href="/#faqs">FAQs</a>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-center focus:bg-transparent">
            {!ignoreRender.find(x => x.name === 'login') && (
              <a href="/login" className="w-64">
                <Button variant="outline" className="w-full text-sm">
                  Login
                </Button>
              </a>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-center focus:bg-transparent">
            <a href="/signup" className="w-64">
              <Button className="w-full text-sm">Sign Up</Button>
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}