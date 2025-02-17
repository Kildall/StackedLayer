import { useState, type FC } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import type { User } from "@/db/schema";
import { createAndUploadSecret } from "@/islands/secrets/CreateSecret";
import { FileUploadForm } from "@/islands/forms/FileUploadForm";
import { SecretSuccess } from "@/islands/landing/SecretSuccess";
import type { SecretURL } from "@/types/islands/secrets/secrets";

enum FileUploadState {
  Input = "input",
  Success = "success",
  Fail = "fail",
}

interface FileUploadIslandProps {
  maxFileSizeMB: number;
  onBack: () => void;
  user?: User;
}

export interface FileData {
  fileName: string;
  fileMimeType: string;
  fileSize: number;
  fileBytes: Uint8Array;
}

export const FileUploadIsland: FC<FileUploadIslandProps> = ({ maxFileSizeMB, onBack }) => {
  const [state, setState] = useState<FileUploadState>(FileUploadState.Input);
  const [secretURL, setSecretURL] = useState<SecretURL | null>(null);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleSubmit = async (file: File) => {
    // When sending
    const fileMetadata = {
      fileName: file.name,
      fileMimeType: file.type || "application/octet-stream",
      fileSize: file.size,
    };

    const fileBytes = new Uint8Array(await file.arrayBuffer());
    // Combine metadata and bytes in a single array
    const combinedData = new Uint8Array([
      ...new TextEncoder().encode(JSON.stringify(fileMetadata)),
      0, // Null byte separator
      ...fileBytes
    ]);

    const { id, key, expiresAt } = await createAndUploadSecret(combinedData, "file");
    setState(FileUploadState.Success);
    setExpiryDate(expiresAt.toISOString());
    setSecretURL({ id, key });
    setFileName(file.name);
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

        <div className="flex-1">
          {state === FileUploadState.Input && (
            <FileUploadForm
              maxFileSizeMB={maxFileSizeMB}
              onSubmit={handleSubmit}
            />
          )}
          {state === FileUploadState.Success && secretURL && (
            <SecretSuccess
              secretURL={secretURL}
              expiryDate={expiryDate ?? ""}
              type="file"
              fileName={fileName ?? undefined}
            />
          )}
        </div>
      </Card>
    </motion.div>
  );
};