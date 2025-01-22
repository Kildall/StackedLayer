import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FC } from "react";

interface BackButtonProps {
  href: string;
  children?: React.ReactNode;
}

export const BackButtonIsland: FC<BackButtonProps> = ({ href, children }) => {
  const handleClick = () => {
    window.location.href = href;
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleClick}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      {children || "Back to Homepage"}
    </Button>
  );
}; 