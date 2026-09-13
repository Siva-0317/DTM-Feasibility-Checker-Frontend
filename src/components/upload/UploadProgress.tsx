import { useEffect, useState } from "react";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Loader2 } from "lucide-react";

interface UploadProgressProps {
  filename: string;
  isUploading: boolean;
  isProcessing: boolean;
  progress: number;
}

const MESSAGES = [
  "Reading B-Rep topology...",
  "Measuring hem flanges...",
  "Checking corner radii...",
  "Counting drain holes...",
  "Evaluating 10 DTM rules...",
];

export function UploadProgress({
  filename,
  isUploading,
  isProcessing,
  progress,
}: UploadProgressProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isProcessing) return;

    const intervalId = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [isProcessing]);

  let statusText = "";
  if (isUploading) {
    statusText = "Uploading...";
  } else if (isProcessing) {
    statusText = MESSAGES[messageIndex];
  } else {
    statusText = "Complete";
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-5 rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="font-mono bg-zinc-900/50 truncate max-w-[200px] border-zinc-700">
          {filename}
        </Badge>
        <span className="text-sm text-muted-foreground font-mono">
          {progress}%
        </span>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="flex items-center gap-3 text-sm text-zinc-400">
        {(isUploading || isProcessing) && (
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        )}
        <span className="animate-pulse font-medium">{statusText}</span>
      </div>
    </div>
  );
}
