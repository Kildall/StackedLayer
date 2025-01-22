import { FileUp, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { FC } from "react";

// Define the mode type
export type LandingModeSelector = "select" | "file" | "secret" | "login";

interface SelectModeProps {
  setMode: (mode: LandingModeSelector) => void;
  loginRequired: boolean;
  isLoggedIn: boolean;
}

export const SelectModeIsland: FC<SelectModeProps> = ({ 
  setMode, 
  loginRequired, 
  isLoggedIn 
}) => {
  const handleSetMode = (mode: LandingModeSelector) => {
    if (loginRequired && !isLoggedIn) {
      setMode("login");
    } else {
      setMode(mode);
    }
  };

  return (
    <Card className="p-6 min-h-[250px] flex flex-col justify-between">
      <h2 className="text-2xl font-bold text-center mb-8">
        What would you like to share?
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          size="lg"
          className="h-32 flex flex-col items-center justify-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={() => handleSetMode("file")}
        >
          <FileUp className="h-8 w-8" />
          <span>Upload File</span>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-32 flex flex-col items-center justify-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={() => handleSetMode("secret")}
        >
          <Lock className="h-8 w-8" />
          <span>Type Secret</span>
        </Button>
      </div>
    </Card>
  );
};