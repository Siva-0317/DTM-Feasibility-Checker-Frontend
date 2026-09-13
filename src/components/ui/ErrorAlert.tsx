import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "./button";

interface ErrorAlertProps {
  message: string;
  onRetry: () => void;
}

export function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-red-950/20 border border-red-900/50 text-center mx-auto max-w-xl animate-in zoom-in-95 backdrop-blur-md shadow-2xl">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-2xl font-bold text-red-500 mb-3 tracking-tight">An Error Occurred</h3>
      <p className="text-zinc-400 font-medium">{message}</p>
      <Button 
        onClick={onRetry}
        variant="outline"
        className="mt-8 px-6 bg-red-900/40 hover:bg-red-900/80 text-red-200 font-semibold border-red-800/50 transition-all active:scale-95"
      >
        <RefreshCcw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
}
