import { useState, type FC } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, CopyIcon, Info, Link as LinkIcon, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SecretURL } from "@/types/islands/secrets/secrets"
import { PUBLIC_FRONTEND_URL } from "astro:env/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TooltipContent, Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useToast } from "hooks/use-toast"

interface SecretSuccessProps {
  secretURL: SecretURL
  expiryDate: string
  type: 'text' | 'file'
  fileName?: string
}

export const SecretSuccess: FC<SecretSuccessProps> = ({ secretURL, expiryDate, type, fileName }) => {
  const [showUrlInfo, setShowUrlInfo] = useState(false);
  const { toast } = useToast();
  const shareUrl = `${PUBLIC_FRONTEND_URL}/secrets/${secretURL.id}#${secretURL.key}`;
  const fullBaseUrl = `${PUBLIC_FRONTEND_URL}/secrets/${secretURL.id}`;
  const baseUrl = `/secrets/${secretURL.id}`;

  const copyToClipboard = async (text: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied successfully",
        description: successMessage,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-full"
    >
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-2">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <CardTitle>
              {type === 'file' ? 'File uploaded' : 'Secret saved'} successfully!
            </CardTitle>
            {fileName && (
              <CardDescription className="flex items-center justify-center gap-2 py-2">
                <File className="h-4 w-4" />
                <span className="font-normal text-xs">{fileName}</span>
              </CardDescription>
            )}
          </div>
        </CardHeader>
      </Card>


      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Share link</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs flex items-center gap-1"
                  onClick={() => setShowUrlInfo(!showUrlInfo)}
                >
                  <Info className="h-3.5 w-3.5" />
                  <span>URL Structure</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>See how the secret URL is structured and learn about the optional key</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative group">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="w-full px-3 py-2 rounded-md bg-muted text-sm font-mono text-muted-foreground"
            />
          </div>
          <Button onClick={() => copyToClipboard(shareUrl, "The share link has been copied to your clipboard.")}>
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>

        <AnimatePresence>
          {showUrlInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Alert className="mt-2">
                <AlertDescription>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">URL Structure</p>
                      <p className="text-xs text-muted-foreground">Your secret URL contains two components:</p>
                    </div>

                    <div className="grid gap-3">
                      <Card>
                        <CardContent className="p-3 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            <span className="text-xs font-medium">Secret ID</span>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1 relative group">
                              <input
                                type="text"
                                value={secretURL.id}
                                readOnly
                                className="w-full px-3 py-2 rounded-md bg-muted text-xs font-mono text-muted-foreground"
                              />
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => copyToClipboard(fullBaseUrl, "Base URL copied to clipboard")}
                            >
                              <CopyIcon className="h-2 w-2" />
                            </Button>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            The unique identifier for your secret, this value is stored in the database.
                          </span>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-3 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-xs font-medium">Optional Decryption Key</span>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1 relative group">
                              <input
                                type="text"
                                value={secretURL.key}
                                readOnly
                                className="w-full px-3 py-2 rounded-md bg-muted text-xs font-mono text-muted-foreground"
                              />
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => copyToClipboard(secretURL.key, "Decryption key copied to clipboard")}
                            >
                              <CopyIcon className="h-2 w-2" />
                            </Button>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            The optional decryption key is used to encrypt the secret, it is not stored anywhere and is only visible to you now. 
                          </span>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-2 rounded-lg border p-3">
                      <p className="text-xs">
                        <span className="font-medium">Complete URL Format:</span> The two components are combined using a <code className="px-1 py-0.5 bg-muted rounded">#</code> symbol as separator
                      </p>
                      <ScrollArea className="w-full whitespace-nowrap rounded" >
                        <div className="w-full p-2 bg-muted/50">
                          <code className="block w-full px-2 py-1.5 text-xs rounded text-muted-foreground">
                            {baseUrl}<span className="text-blue-500 font-bold">#</span>{secretURL.key}
                          </code>
                        </div>
                        <ScrollBar orientation="horizontal" className="mt-2" />
                      </ScrollArea>
                    </div>
                    <p className="text-xs text-muted-foreground text-justify">
                      If the decryption key is not included in the URL, it can be entered manually on the page by using only the identifier (without the # and key).
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {expiryDate && (
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">
            This {type === 'file' ? 'file' : 'secret'} will be deleted on {new Date(expiryDate).toLocaleDateString()} at {new Date(expiryDate).toLocaleTimeString()}
          </span>
        </div>
      )}
    </motion.div>
  );
};