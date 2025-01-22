import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { signOut } from "auth-astro/client";
import { type FC, useState, useEffect } from "react";
import type { Session } from "@auth/core/types";

interface UserProfileProps {
  session: string;
}

export const UserProfileIsland: FC<UserProfileProps> = ({ session }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!session) {
    return null;
  }

  const sessionData: Session | null = JSON.parse(session);
  if (!sessionData?.user) {
    return null;
  }

  if (!isClient) {
    return (
      <div className="hidden md:flex items-center gap-2">
        <div className="h-9 px-4 py-2 bg-primary/10 rounded-md animate-pulse" />
        <div className="h-9 px-4 py-2 bg-primary/10 rounded-md animate-pulse" />
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center">
      <a href="/user">
        <Button variant="default" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>{sessionData.user.email}</span>
        </Button>
      </a>
      <Button 
        variant="outline" 
        className="flex items-center gap-2 ml-2" 
        onClick={() => signOut()}
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </Button>
    </div>
  );
};