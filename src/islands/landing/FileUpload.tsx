import { useState, type FC } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Link as LinkIcon, Check } from "lucide-react";
import { useToast } from "hooks/use-toast";
import { motion } from "framer-motion";
import type { User } from "@/db/schema";
import { PUBLIC_FRONTEND_URL } from "astro:env/client";

interface FileUploadIslandProps {
  maxFileSizeMB: number;
  user?: User;
  onBack: () => void;
}

export const FileUploadIsland: FC<FileUploadIslandProps> = ({ maxFileSizeMB, onBack }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const { toast } = useToast();

  const MAX_FILE_SIZE = maxFileSizeMB * 1024 * 1024;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxFileSizeMB}MB`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.length) {
      if (validateFile(files[0])) {
        await handleUpload(files[0]);
      }
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      if (validateFile(files[0])) {
        await handleUpload(files[0]);
      }
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileContent = await file.arrayBuffer();
      const base64File = btoa(
        new Uint8Array(fileContent).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      const body = {
        secret: base64File,
        type: "file",
        fileName: file.name,
        fileMimeType: file.type,
        fileSize: file.size,
      }
      const response = await fetch('/api/secrets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });
      const data: { accessToken: string, expiresAt: string } = await response.json();
      setUploaded(true);
      setExpiryDate(data.expiresAt);
      setShareLink(`${PUBLIC_FRONTEND_URL}/secrets/${data.accessToken}`);
      toast({
        title: "File uploaded successfully",
        description: "Your file has been uploaded and is ready to share.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
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
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="w-full"
    >
      <Card className="p-6 min-h-[250px] flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Upload File</h1>
        </div>

        {!uploaded ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploading ? (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Uploading your file...</p>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">
                  Drag and drop your file here, or
                </p>
                <label className="inline-block">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                  <span className="text-primary hover:underline cursor-pointer">
                    browse to upload
                  </span>
                </label>
                <p className="text-sm text-muted-foreground mt-4">
                  Maximum file size: {maxFileSizeMB}MB
                </p>
              </>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex flex-col items-center justify-center gap-2 text-green-500">
              <Check className="h-12 w-12" />
              <span className="font-medium">File uploaded successfully!</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-3 py-2 rounded-md bg-muted text-sm font-mono text-muted-foreground"
              />
              <Button onClick={copyLink}>
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
            {expiryDate && (
              <span className="text-sm text-muted-foreground">
                This file will be deleted on {new Date(expiryDate).toLocaleDateString()} at {new Date(expiryDate).toLocaleTimeString()}
              </span>
            )}
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}