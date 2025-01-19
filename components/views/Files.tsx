'use client'

import { FC, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";


interface FilesProps {}

export const Files: FC<FilesProps> = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);

  useEffect(() => {
    // Mock API call
    const fetchFileInfo = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (id === "demo") {
        setFileInfo({
          name: "example.pdf",
          size: "2.5 MB"
        });
      } else {
        router.push("/404");
      }
      setLoading(false);
    };
    fetchFileInfo();
  }, [id, router]);

  const downloadFile = () => {
    // Mock download
    console.log("Downloading file...");
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
            <h1 className="text-2xl font-bold">Download File</h1>
          </div>

          {loading ? (
            <div className="h-32 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : fileInfo ? (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-muted">
                <p className="font-medium">{fileInfo.name}</p>
                <p className="text-sm text-muted-foreground">{fileInfo.size}</p>
              </div>
              <Button onClick={downloadFile} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download File
              </Button>
            </div>
          ) : null}
        </Card>
      </motion.div>
    </div>
  );
};