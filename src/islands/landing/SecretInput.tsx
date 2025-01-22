import { useState, type FC } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Link as LinkIcon, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface SecretInputProps {
  onBack: () => void;
  maxSecretLength: number;
} 

export const SecretInputIsland: FC<SecretInputProps> = ({ onBack, maxSecretLength }) => {
  const [secret, setSecret] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const { toast } = useToast();

  const MAX_CHARS = maxSecretLength;
  const remainingChars = MAX_CHARS - secret.length;

  const handleSubmit = async () => {
    if (!secret.trim()) return;

    setSubmitting(true);
    try {
      // Replace with your actual API endpoint
      // const response = await fetch('/api/secrets', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ secret })
      // });
      // const data = await response.json();
      
      // Mock API call for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      // Use import.meta.env instead of process.env for Astro
      setShareLink(`${import.meta.env.PUBLIC_FRONTEND_URL}/secrets/${secret}`);
      toast({
        title: "Secret saved successfully",
        description: "Your secret has been saved and is ready to share.",
      });
    } catch (error) {
      toast({
        title: "Error saving secret",
        description: "There was an error saving your secret. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSecretChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setSecret(value);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast({
        title: "Link copied",
        description: "The share link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy link to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 min-h-[250px] flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Type Secret</h1>
      </div>

      {!submitted ? (
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="Type your secret message here..."
              value={secret}
              onChange={handleSecretChange}
              className="min-h-[150px] max-h-[250px]"
            />
            <div 
              className={`text-sm mt-1 text-right ${
                remainingChars < 100 ? 'text-destructive' : 'text-muted-foreground'
              }`}
            >
              {remainingChars} characters remaining
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!secret.trim() || submitting}
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              "Save Secret"
            )}
          </Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-green-500">
            <Check className="h-6 w-6" />
            <span className="font-medium">Secret saved successfully!</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 px-3 py-2 rounded-md bg-muted"
            />
            <Button onClick={copyLink}>
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </Card>
  );
};