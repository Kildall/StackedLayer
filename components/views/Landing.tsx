'use client'

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Lock, Shield } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { SecretInput } from "@/components/SecretInput";
import { Waves } from "../ui/waves-background";


interface LandingProps {
  defaultMode?: "select" | "file" | "secret";
  maxFileSizeMB: number;
  maxSecretLength: number;
}


export const Landing: FC<LandingProps> = ({ defaultMode = "select", maxFileSizeMB, maxSecretLength }) => {
  const [mode, setMode] = useState<"select" | "file" | "secret">(defaultMode);
  const authed = false;

  return (
    <>
      <div className="absolute inset-0">
        <Waves
          lineColor="rgba(0, 0, 0, 0.3)"
          backgroundColor="transparent"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center my-12">
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
            Share Secrets Securely
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            End-to-end encrypted file and secret sharing. Your data is automatically deleted after being viewed,
            ensuring your sensitive information stays private and secure.
          </p>
        </div>

        {/* Invite Only Warning */}
        <div className="relative w-full max-w-md mx-auto bg-white z-10 mb-8">
          <Card className="p-6 bg-white/95 backdrop-blur border-2 border-primary">
            <div className="text-center">
              <Lock className="h-12 w-12 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Invite Only Access</h2>
              <p className="text-muted-foreground mb-6">
                This service is currently invite-only. If you have an invite code, please sign up to get started.
              </p>
              <Button className="w-full" size="lg">
                Sign Up with Invite
              </Button>
            </div>
          </Card>
        </div>

        {/* Mode Selector */}
        {authed && (
          <AnimatePresence mode="wait">
          {mode === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative w-full max-w-md mx-auto bg-white z-10"
            >
              <Card className="p-6 bg-white">
                <h2 className="text-2xl font-bold text-center mb-8">What would you like to share?</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-32 flex flex-col items-center justify-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => setMode("file")}
                  >
                    <FileUp className="h-8 w-8" />
                    <span>Upload File</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-32 flex flex-col items-center justify-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => setMode("secret")}
                  >
                    <Lock className="h-8 w-8" />
                    <span>Type Secret</span>
                  </Button>
                </div>
              </Card>
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
              <FileUpload onBack={() => setMode("select")} maxFileSizeMB={maxFileSizeMB} />
            </motion.div>
          )}

          {mode === "secret" && (
            <motion.div
              key="secret"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="w-full max-w-md mx-auto"
            >
              <SecretInput onBack={() => setMode("select")} maxSecretLength={maxSecretLength} />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">End-to-End Encryption</h3>
            <p className="text-muted-foreground">Your data is encrypted before it leaves your browser</p>
          </div>
          <div className="p-6">
            <Lock className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">One-Time Access</h3>
            <p className="text-muted-foreground">Files and secrets are deleted immediately after being viewed</p>
          </div>
          <div className="p-6">
            <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Open Source</h3>
            <p className="text-muted-foreground">Fully transparent, auditable code you can trust</p>
          </div>
        </div>
      </div>
    </>
  );
};