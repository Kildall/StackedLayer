'use client'
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full max-w-md"
  >
    <Card className="p-6 text-center">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl text-muted-foreground mb-6">
        Content Not Found
      </p>
      <p className="text-muted-foreground mb-6">
        The content you&apos;re looking for has either expired or doesn&apos;t exist.
      </p>
      <Button onClick={() => router.push("/")} className="w-full">
        <Home className="h-4 w-4 mr-2" />
        Return Home
        </Button>
      </Card>
    </motion.div>
  </div>
  );
}
