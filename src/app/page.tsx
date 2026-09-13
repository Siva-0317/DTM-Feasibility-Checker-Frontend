"use client";

import { useState, useEffect } from "react";
import { DropZone } from "@/components/upload/DropZone";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { CADViewer } from "@/components/viewer/CADViewer";
import { DTMReport } from "@/components/results/DTMReport";
import { AIReport } from "@/components/results/AIReport";
import { useJobPolling } from "@/hooks/useJobPolling";
import { useCADViewer } from "@/hooks/useCADViewer";
import { getRemediationReport, getMeshUrl } from "@/lib/api";
import { RemediationReport } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Hexagon, Layers, Cpu, Box } from "lucide-react";

export default function Home() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [aiReport, setAiReport] = useState<RemediationReport | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [focusTarget, setFocusTarget] = useState<[number, number, number] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { job, isPolling, error: pollError } = useJobPolling(jobId);
  const { defectCoordinates, setDefects, clearViewer } = useCADViewer();

  // Determine App State
  const isStateEmpty = !jobId;
  const isStateProcessing = jobId && (!job || job.status === "PENDING" || job.status === "PROCESSING" || isPolling);
  const isStateComplete = job?.status === "COMPLETE";

  useEffect(() => {
    if (job?.result) {
      setDefects(job.result.rules);
    } else {
      clearViewer();
    }
  }, [job?.result, setDefects, clearViewer]);

  const handleUploadComplete = (newJobId: string) => {
    setJobId(newJobId);
    setErrorMsg(null);
    setAiReport(null);
    setFocusTarget(null);
  };

  const handleFocusDefect = (coords: [number, number, number][]) => {
    if (coords && coords.length > 0) {
      setFocusTarget(coords[0]);
    }
  };

  const handleRequestAI = async () => {
    if (!jobId) return;
    setIsGeneratingAI(true);
    try {
      const report = await getRemediationReport(jobId);
      setAiReport(report);
    } catch (err: any) {
      console.error("Failed to fetch AI report", err);
      // Fallback for demo purposes if backend AI route fails or times out
      setErrorMsg(err.message || "Failed to generate AI report");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 lg:p-10 bg-background text-foreground">
      
      {/* Header */}
      <div className="w-full max-w-7xl flex flex-col items-center text-center mb-12">
        <div className="flex items-center gap-4 mb-4 mt-6">
          <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500 ring-1 ring-indigo-500/20 shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)]">
            <Hexagon className="w-8 h-8" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">BIW DTM Checker</h1>
        </div>
        <p className="text-zinc-400 font-bold tracking-widest uppercase text-xs">
          Stellantis Door Standards
        </p>
      </div>

      <div className="w-full max-w-7xl flex-1 flex flex-col">
        
        {/* STATE 1 - Empty */}
        {isStateEmpty && (
          <div className="flex-1 flex flex-col items-center justify-center -mt-10 animate-in fade-in zoom-in-95 duration-500">
            <DropZone onUploadComplete={handleUploadComplete} onError={setErrorMsg} />
            
            {errorMsg && (
              <div className="mt-8 p-4 rounded-xl bg-red-950/40 border border-red-900/50 text-red-400 max-w-lg text-center text-sm font-medium">
                {errorMsg}
              </div>
            )}
            
            <div className="mt-24 flex flex-wrap justify-center gap-5 opacity-40 hover:opacity-100 transition-opacity duration-500">
              <Badge variant="outline" className="bg-zinc-900/50 border-zinc-800 text-zinc-300 py-1.5 px-3"><Box className="w-3.5 h-3.5 mr-2 text-blue-400" /> FastAPI</Badge>
              <Badge variant="outline" className="bg-zinc-900/50 border-zinc-800 text-zinc-300 py-1.5 px-3"><Layers className="w-3.5 h-3.5 mr-2 text-yellow-500" /> pythonocc</Badge>
              <Badge variant="outline" className="bg-zinc-900/50 border-zinc-800 text-zinc-300 py-1.5 px-3"><Hexagon className="w-3.5 h-3.5 mr-2 text-green-400" /> Three.js</Badge>
              <Badge variant="outline" className="bg-zinc-900/50 border-zinc-800 text-zinc-300 py-1.5 px-3"><Cpu className="w-3.5 h-3.5 mr-2 text-indigo-400" /> Llama 3.2</Badge>
            </div>
          </div>
        )}

        {/* STATE 2 - Processing */}
        {isStateProcessing && (
          <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
            <UploadProgress 
              filename={job?.filename || "Loading..."}
              isUploading={false}
              isProcessing={true}
              progress={100} 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full h-[600px] pointer-events-none">
              <div className="lg:col-span-7 bg-zinc-900/20 rounded-xl border border-zinc-800/50 flex items-center justify-center overflow-hidden relative backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent w-full h-[15%] animate-[bounce_4s_infinite]" />
                <Box className="w-20 h-20 text-zinc-800 animate-pulse" />
              </div>
              
              <div className="lg:col-span-5 bg-zinc-900/20 rounded-xl border border-zinc-800/50 p-8 flex flex-col gap-6 backdrop-blur-sm">
                <div className="w-40 h-8 bg-zinc-800/30 rounded-md animate-pulse" />
                <div className="w-full h-28 bg-zinc-800/30 rounded-xl animate-pulse" />
                <div className="w-full h-28 bg-zinc-800/30 rounded-xl animate-pulse" />
                <div className="w-full h-28 bg-zinc-800/30 rounded-xl animate-pulse mt-auto" />
              </div>
            </div>
          </div>
        )}

        {/* STATE 3 - Complete */}
        {isStateComplete && job?.result && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full animate-in slide-in-from-bottom-12 fade-in duration-1000">
            <div className="lg:col-span-7 lg:sticky lg:top-10 h-[500px] md:h-[700px] z-10">
              <CADViewer 
                glbUrl={jobId ? getMeshUrl(jobId) : null} 
                defects={defectCoordinates}
                focusTarget={focusTarget}
                onModelLoaded={() => {}}
              />
            </div>
            
            <div className="lg:col-span-5 flex flex-col pb-20">
              <DTMReport 
                report={job.result} 
                onFocusDefect={handleFocusDefect} 
                onRequestAI={handleRequestAI}
                isLoadingAI={isGeneratingAI}
              />
              
              {(aiReport || isGeneratingAI) && (
                <AIReport report={aiReport} isLoading={isGeneratingAI} />
              )}
            </div>
          </div>
        )}

        {/* Error State */}
        {(pollError || job?.status === "FAILED") && !isStateEmpty && (
          <div className="mt-12 p-8 rounded-2xl bg-red-950/20 border border-red-900/50 text-center mx-auto max-w-xl animate-in zoom-in-95 backdrop-blur-md shadow-2xl">
            <h3 className="text-2xl font-bold text-red-500 mb-3 tracking-tight">Validation Failed</h3>
            <p className="text-zinc-400 font-medium">{pollError || "An unexpected error occurred during geometry processing."}</p>
            <button 
              onClick={() => setJobId(null)}
              className="mt-8 px-6 py-2.5 bg-red-900/40 hover:bg-red-900/80 text-red-200 font-semibold rounded-lg transition-all active:scale-95 border border-red-800/50"
            >
              Start New Analysis
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
