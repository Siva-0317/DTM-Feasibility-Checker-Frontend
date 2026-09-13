"use client";

import { RotateCcw, Grid3X3, Focus } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface ViewerControlsProps {
  onResetCamera: () => void;
  onToggleWireframe: () => void;
  isWireframe: boolean;
  onFocusDefects?: () => void;
}

export function ViewerControls({ 
  onResetCamera, 
  onToggleWireframe, 
  isWireframe, 
  onFocusDefects 
}: ViewerControlsProps) {
  return (
    <div className="absolute bottom-6 right-6 flex items-center gap-2 p-2 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl z-10">
      <Button
        variant="ghost"
        size="icon"
        onClick={onResetCamera}
        className="w-10 h-10 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        title="Reset Camera"
      >
        <RotateCcw className="w-5 h-5" />
      </Button>
      
      {onFocusDefects && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onFocusDefects}
          className="w-10 h-10 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          title="Focus Defects"
        >
          <Focus className="w-5 h-5" />
        </Button>
      )}

      <div className="w-px h-6 bg-zinc-800 mx-1" />

      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleWireframe}
        className={cn(
          "w-10 h-10 transition-colors",
          isWireframe 
            ? "text-primary bg-primary/10 hover:bg-primary/20" 
            : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
        )}
        title="Toggle Wireframe"
      >
        <Grid3X3 className="w-5 h-5" />
      </Button>
    </div>
  );
}
