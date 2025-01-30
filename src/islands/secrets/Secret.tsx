import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, EyeOff, File, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

interface SecretIslandProps {
  secret: string;
  oneTime: boolean;
}

interface SecretResponse {
  type: "text" | "file";
  content: string;
  expiresAt: string;
  fileData?: {
    fileName: string;
    fileMimeType: string;
    fileSize: number;
  };
}

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

export const SecretIsland: React.FC<SecretIslandProps> = ({ secret, oneTime }) => {
  const [secretData, setSecretData] = useState<SecretResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    async function fetchSecret() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/secrets?secret=${secret}`);
        if (!response.ok) {
          if (response.headers.get("Content-Type") === "application/json") {
            const data = await response.json();
            setError(data.error);
          } else {
            setError("An error occurred");
          }
        } else {
          const data = await response.json();
          setSecretData(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    }
    fetchSecret();
  }, [secret]);

  const handleDownload = () => {
    if (!secretData?.fileData) return;
    
    const blob = new Blob([secretData.content], { type: secretData.fileData.fileMimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = secretData.fileData.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
                              {secretData.content}
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
                    <Button variant="ghost" className="text-sm text-primary-foreground flex items-center">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      <a href="/">Go Back</a>
                    </Button>
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