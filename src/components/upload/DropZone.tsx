"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { UploadCloud, FileType, DoorClosed } from "lucide-react";
import { uploadCADFile } from "../../lib/api";
import { Button } from "../ui/button";
import { UploadProgress } from "./UploadProgress";
import { cn } from "../../lib/utils";

interface DropZoneProps {
  onUploadComplete: (jobId: string) => void;
  onError: (error: string) => void;
}

export function DropZone({ onUploadComplete, onError }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [doorType, setDoorType] = useState<"front" | "rear">("front");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulated progress logic for upload since standard fetch/axios doesn't easily expose stream progress without custom XHR adapters
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isUploading && uploadProgress < 95) {
      interval = setInterval(() => {
        setUploadProgress((prev) => {
          const jump = Math.random() * 15;
          const next = prev + jump;
          return next > 95 ? 95 : Math.floor(next);
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isUploading, uploadProgress]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateAndUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".stp") && !file.name.toLowerCase().endsWith(".step")) {
      onError("Invalid file type. Please upload a .stp or .step file.");
      return;
    }

    if (file.size > 1024 * 1024 * 1024) {
      onError("File is too large. Maximum size is 1GB.");
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await uploadCADFile(file, doorType);
      setUploadProgress(100);
      setIsUploading(false);
      onUploadComplete(response.job_id);
    } catch (err: any) {
      setIsUploading(false);
      setSelectedFile(null);
      onError(err.response?.data?.message || err.message || "Failed to upload file.");
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        validateAndUpload(e.dataTransfer.files[0]);
      }
    },
    [doorType, onError] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUpload(e.target.files[0]);
    }
  };

  if (isUploading || selectedFile) {
    return (
      <div className="flex justify-center w-full py-10">
        <UploadProgress
          filename={selectedFile?.name || "Uploading..."}
          isUploading={isUploading}
          isProcessing={!isUploading && selectedFile !== null}
          progress={uploadProgress}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center p-16 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ease-in-out bg-gradient-to-b from-zinc-900/40 to-zinc-950/40 shadow-xl",
          isDragging
            ? "border-green-500 bg-green-500/10 shadow-green-900/20"
            : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".stp,.step"
          className="hidden"
        />

        <div className="p-4 rounded-full bg-zinc-800/80 text-zinc-400 mb-5 transition-transform duration-300 group-hover:scale-110">
          <UploadCloud className={cn("w-10 h-10 transition-colors", isDragging ? "text-green-400" : "text-zinc-400")} />
        </div>

        <h3 className="text-2xl font-semibold text-zinc-200 mb-2 tracking-tight">
          Drop your STEP file here
        </h3>
        <p className="text-sm text-zinc-400 text-center mb-8 max-w-sm">
          Supports .stp and .step files &middot; Max 1GB
        </p>

        <div className="absolute bottom-4 flex items-center gap-2 text-xs font-medium text-zinc-500 bg-zinc-900/80 px-3 py-1.5 rounded-full">
          <FileType className="w-3.5 h-3.5" /> or click to browse
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
          Select Door Type
        </p>
        <div className="flex gap-4 p-1 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <Button
            variant="ghost"
            onClick={() => setDoorType("front")}
            className={cn(
              "w-36 h-10 transition-all",
              doorType === "front" 
                ? "bg-zinc-800 text-zinc-100 shadow-sm" 
                : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
            )}
          >
            <DoorClosed className="w-4 h-4 mr-2" />
            Front Door
          </Button>
          <Button
            variant="ghost"
            onClick={() => setDoorType("rear")}
            className={cn(
              "w-36 h-10 transition-all",
              doorType === "rear" 
                ? "bg-zinc-800 text-zinc-100 shadow-sm" 
                : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
            )}
          >
            <DoorClosed className="w-4 h-4 mr-2" />
            Rear Door
          </Button>
        </div>
      </div>
    </div>
  );
}
