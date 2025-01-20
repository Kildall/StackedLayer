"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, Menu, Shield, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface IgnoreRenderComponent {
  name: 'login' | 'signup';
  path: string;
}

export const Navbar = () => {
  const [ignoreRender, setIgnoreRender] = useState<IgnoreRenderComponent[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    switch (pathname) {
      case "/login":
        setIgnoreRender([{ name: "login", path: "/login" }]);
        break;
      case "/signup":
        setIgnoreRender([{ name: "signup", path: "/signup" }]);
        break;
    }
  }, [pathname]);

  return (
    <Card className="container bg-card py-3 px-4 border-0 flex items-center justify-between gap-6 rounded-2xl mt-5 z-10">
      <ul className="hidden md:flex items-center gap-10 text-card-foreground">
        <li className="text-primary font-medium">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            <h1 className="text-xl font-bold">StackedLayer</h1>
          </Link>
        </li>
        <li>
          <Link href="/#features">Features</Link>
        </li>
        <li>
          <Link href="/#faqs">FAQs</Link>
        </li>
      </ul>

      <div className="flex items-center">
        {ignoreRender.find(x => x.name === 'login') ? null : (
          <Link href="/login">
            <Button variant="outline" className="hidden px-2 md:flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Login
            </Button>
          </Link>
        )}

        {ignoreRender.find(x => x.name === 'signup') ? null : (
          <Link href="/signup">
            <Button className="hidden md:flex items-center gap-2 ml-2 mr-2">
              <UserPlus className="w-4 h-4" />
              Sign Up
            </Button>
          </Link>
        )}

        <div className="flex md:hidden mx-2 items-center gap-2 ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5 rotate-0 scale-100" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-screen p-4 font-medium">
              <DropdownMenuItem>
                <Link href="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/#features">Features</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/#faqs">FAQs</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex justify-center focus:bg-transparent">
                {ignoreRender.find(x => x.name === 'login') ? null : (
                  <Link href="/login" className="w-64">
                    <Button variant="outline" className="w-full text-sm">
                      Login
                    </Button>
                  </Link>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem className="flex justify-center focus:bg-transparent">
                {ignoreRender.find(x => x.name === 'signup') ? null : (
                  <Link href="/signup" className="w-64">
                    <Button className="w-full text-sm">Sign Up</Button>
                  </Link>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
};
