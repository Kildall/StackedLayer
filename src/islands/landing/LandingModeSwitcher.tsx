import { useState, type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SelectModeIsland } from "@/islands/landing/SelectMode";
import { FileUploadIsland } from "@/islands/landing/file-upload/FileUpload";
import { LoginRequiredIsland } from "@/islands/landing/LoginRequired";
import type { User } from "@/db/schema";
import { SecretInputIsland } from "@/islands/landing/secret-input/SecretInput";

export type LandingModeSelector = "select" | "file" | "text" | "login";

interface LandingModeSwitcherProps {
  defaultMode?: LandingModeSelector;
  maxFileSizeMB: number;
  maxSecretLength: number;
  loginRequired: boolean;
  user?: User;
}

export const LandingModeSwitcherIsland: FC<LandingModeSwitcherProps> = ({
  defaultMode = "select",
  maxFileSizeMB,
  maxSecretLength,
  loginRequired,
  user,
}) => {
  const isLoggedIn = !!user;
  const [mode, setMode] = useState<LandingModeSelector>(defaultMode);

  return (
    <AnimatePresence mode="wait">
      {mode === "select" && (
        <motion.div
          key="select"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative w-full max-w-md mx-auto bg-white z-10"
        >
          <SelectModeIsland 
            setMode={setMode} 
            loginRequired={loginRequired} 
            isLoggedIn={isLoggedIn} 
          />
        </motion.div>
      )}

      {mode === "file" && (
        <motion.div
          key="file"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="w-full max-w-md mx-auto"
        >
          <FileUploadIsland 
            onBack={() => setMode("select")} 
            maxFileSizeMB={maxFileSizeMB} 
            user={user}
          />
        </motion.div>
      )}

      {mode === "text" && (
        <motion.div
          key="text"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="w-full max-w-md mx-auto"
        >
          <SecretInputIsland 
            onBack={() => setMode("select")} 
            maxSecretLength={maxSecretLength} 
          />
        </motion.div>
      )}

      {mode === "login" && (
        <motion.div
          key="login"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="w-full max-w-md mx-auto"
        >
          <LoginRequiredIsland onBack={() => setMode("select")} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}