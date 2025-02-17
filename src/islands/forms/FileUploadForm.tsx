import { useState, type FC } from "react";
import { Upload } from "lucide-react";
import { useToast } from "hooks/use-toast";

interface FileUploadFormProps {
  maxFileSizeMB: number;
  onSubmit: (file: File) => Promise<void>;
}

export const FileUploadForm: FC<FileUploadFormProps> = ({ maxFileSizeMB, onSubmit }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
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
      await onSubmit(file);
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

  return (
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
  );
};