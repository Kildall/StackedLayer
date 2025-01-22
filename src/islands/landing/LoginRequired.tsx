import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { FC } from "react";

interface LoginRequiredProps {
  onBack: () => void;
}

export const LoginRequiredIsland: FC<LoginRequiredProps> = ({ onBack }) => {
  return (
    <Card className="p-6 min-h-[250px] flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Login Required</h1>
      </div>
      <p className="text-muted-foreground mb-6 flex-grow">
        Please login to continue.
      </p>
      <Button className="w-full" size="lg">
        Login
      </Button>
    </Card>
  );
};