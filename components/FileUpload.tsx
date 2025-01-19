import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Link as LinkIcon, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface FileUploadProps {
  onBack: () => void;
  maxFileSizeMB: number;
}

export const FileUpload = ({ onBack, maxFileSizeMB }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [shareLink, setShareLink] = useState("");
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
        description: "Maximum file size is 20MB",
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

  const handleUpload = async (_file: File) => {
    setUploading(true);
    // Mock upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUploading(false);
    setUploaded(true);
    setShareLink("https://example.com/files/demo");
    toast({
      title: "File uploaded successfully",
      description: "Your file has been uploaded and is ready to share.",
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link copied",
      description: "The share link has been copied to your clipboard.",
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
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
          <div className="flex items-center justify-center gap-2 text-green-500">
            <Check className="h-6 w-6" />
            <span className="font-medium">File uploaded successfully!</span>
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