import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


interface SecretProps { }

export const Secret: FC<SecretProps> = () => {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [secret, setSecret] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API call
    const fetchSecret = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (id === "demo") {
        setSecret("This is a demo secret message!");
      } else {
        router.push("/404");
      }
      setLoading(false);
    };
    fetchSecret();
  }, [id, router]);

  const copyToClipboard = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      toast({
        title: "Copied to clipboard",
        description: "The secret has been copied to your clipboard.",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">View Secret</h1>
          </div>

          {loading ? (
            <div className="h-32 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : secret ? (
            <div className="space-y-4">
              <div className="relative">
                <div className={`p-4 rounded-md bg-muted ${!showSecret && "blur-md"}`}>
                  {secret}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button onClick={copyToClipboard} className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </Button>
            </div>
          ) : null}
        </Card>
      </motion.div>
    </div>
  );
};