import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Eye, EyeOff, File, Lock, AlertCircle, ArrowLeft, Key } from 'lucide-react';
import { fetchAndDecryptSecret } from './ViewSecret';
import type { DecryptedSecret } from '@/types/islands/secrets/view-secret';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  const kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(1) + ' KB';
  const mb = kb / 1024;
  return mb.toFixed(1) + ' MB';
};

const fadeInOut = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 }
};

interface SecretIslandProps {
  secret: string;
  oneTime: boolean;
}

const decryptionKeySchema = z.object({
  decryptionKey: z.string().min(1, { message: "Decryption key is required" }).max(512, { message: "Decryption key must be less than 512 characters" }),
});

const DecryptionKeyForm = ({ onSubmit }: { onSubmit: (key: string) => void }) => {
  const form = useForm<z.infer<typeof decryptionKeySchema>>({
    resolver: zodResolver(decryptionKeySchema),
    defaultValues: {
      decryptionKey: '',
    },
  });

  const handleSubmit = (data: z.infer<typeof decryptionKeySchema>) => {
    onSubmit(data.decryptionKey);
  };

  return (
    <motion.div
      {...fadeInOut}
      className="flex flex-col items-center space-y-4"
    >
      <div className="h-12 w-12 rounded-full bg-primary-foreground/10 flex items-center justify-center">
        <Key className="h-6 w-6" />
      </div>

      <div className="text-center space-y-2">
        <h3 className="font-semibold text-lg">Enter Decryption Key</h3>
        <p className="text-sm text-primary-foreground/80">
          This secret requires a decryption key to be viewed
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-4 w-full max-w-sm">
            <FormField
              name="decryptionKey"
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Paste your decryption key"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                  {...field}
                />
              )}
            />
            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              Decrypt Secret
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export const SecretIsland: React.FC<SecretIslandProps> = ({ secret, oneTime }) => {
  const [secretData, setSecretData] = useState<DecryptedSecret | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [decryptionKey, setDecryptionKey] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const id = url.pathname.split('/').pop() ?? "";
    const key = url.hash.slice(1) ?? "";

    if (!id) {
      setError("Invalid Secret URL");
      return;
    }

    if (key) {
      setDecryptionKey(key);
    } else {
      setIsLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    async function fetchSecret() {
      if (!decryptionKey) return;
      const url = new URL(window.location.href);
      const id = url.pathname.split('/').pop() ?? "";

      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchAndDecryptSecret(id, decryptionKey);
        setSecretData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    }
    fetchSecret();
  }, [decryptionKey]);

  const handleDownload = () => {
    if (!secretData?.fileData) return;
    const blob = new Blob([secretData.content], { 
      type: secretData.fileData.fileMimeType 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = secretData.fileData.fileName;
    
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleKeySubmit = (key: string) => {
    setDecryptionKey(key);
  };

  console.log(secretData);

  return (
    <div className="h-full flex">
      <Card className="overflow-hidden bg-primary text-primary-foreground flex-1">
        <CardContent className="p-6 min-h-48 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                key="error"
                {...fadeInOut}
                className="flex items-start space-x-4"
              >
                <AlertCircle className="h-6 w-6 mt-1 flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold text-lg">Unable to Load Secret</h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                  <Button
                    variant="secondary"
                    className="mt-4"
                    onClick={() => window.location.replace("/")}
                  >
                    Go Back
                  </Button>
                </div>
              </motion.div>
            ) : isLoading ? (
              <motion.div
                key="loading"
                {...fadeInOut}
                className="flex flex-col items-center justify-center h-32 space-y-4"
              >
                <div className="relative">
                  <Lock className="w-8 h-8 text-primary-foreground" />
                  <motion.div
                    className="absolute inset-0 border-[1.5px] border-white rounded-full"
                    animate={{
                      scale: [1.3, 1.8, 1.3],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
                <p className="text-primary-foreground text-sm font-medium">Decrypting Secret...</p>
              </motion.div>
            ) : !decryptionKey ? (
              <DecryptionKeyForm onSubmit={handleKeySubmit} />
            ) : secretData ? (
              <motion.div
                key="content"
                {...fadeInOut}
                className="flex flex-col flex-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <motion.div
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      {secretData.type === 'file' ? (
                        <File className="w-5 h-5 text-primary-foreground" />
                      ) : (
                        <Lock className="w-5 h-5 text-primary-foreground" />
                      )}
                    </motion.div>
                    <motion.span
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="font-medium"
                    >
                      {secretData.type === 'file'
                        ? secretData.fileData?.fileName
                        : 'Encrypted Message'}
                    </motion.span>
                  </div>
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsRevealed(!isRevealed)}
                    >
                      {isRevealed ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </motion.div>
                </div>

                <div className="flex-1 my-4">
                  <AnimatePresence>
                    {isRevealed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {secretData.type === 'text' ? (
                          <div className="p-4 bg-muted rounded-md">
                            <pre className="whitespace-pre-wrap break-words font-mono text-sm text-muted-foreground">
                              {new TextDecoder().decode(secretData.content)}
                            </pre>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="text-sm text-primary-foreground">
                              Size: {formatFileSize(secretData.fileData?.fileSize || 0)}
                            </div>
                            <Button
                              onClick={handleDownload}
                              className="w-full"
                              variant="secondary"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download File
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-auto pt-4 border-t border-primary-foreground/10">
                  <div className="flex justify-between items-center">
                    <a href="/">
                      <Button variant="ghost" className="text-sm text-primary-foreground flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                      </Button>
                    </a>
                    <span className="text-sm text-muted-foreground">
                      This {secretData.type === 'file' ? 'file' : 'secret'} {oneTime ? 'has been deleted, it will not be available again' : `will be deleted on ${new Date(secretData.expiresAt).toLocaleDateString()} at ${new Date(secretData.expiresAt).toLocaleTimeString()}`}
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};