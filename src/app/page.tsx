"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { DropZone } from "@/components/upload/DropZone";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { DTMReport } from "@/components/results/DTMReport";
import { AIReport } from "@/components/results/AIReport";
import { useJobPolling } from "@/hooks/useJobPolling";
import { useCADViewer } from "@/hooks/useCADViewer";
import { getRemediationReport, getMeshUrl } from "@/lib/api";
import { RemediationReport } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Hexagon, Layers, Cpu, Box, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

// Lazy load the CAD viewer to prevent SSR issues with Three.js
const CADViewer = dynamic(() => import("@/components/viewer/CADViewer").then(mod => mod.CADViewer), { ssr: false });

export default function Home() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [aiReport, setAiReport] = useState<RemediationReport | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [focusTarget, setFocusTarget] = useState<[number, number, number] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { job, isPolling, error: pollError } = useJobPolling(jobId);
  const { defectCoordinates, setDefects, clearViewer } = useCADViewer();

  const isStateEmpty = !jobId;
  const isStateProcessing = jobId && (!job || job.status === "PENDING" || job.status === "PROCESSING" || isPolling);
  const isStateComplete = job?.status === "COMPLETE";

  useEffect(() => {
    if (job?.result?.dtm_report) {
      setDefects(job.result.dtm_report.rules);
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
      // FastAPI returns errors in { detail: "string" } format
      const detail = err.response?.data?.detail;
      setErrorMsg(detail || err?.message || "Failed to generate AI report");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const resetState = () => {
    setJobId(null);
    setErrorMsg(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 lg:p-10 bg-background text-foreground overflow-x-hidden">
      
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[1400px] flex flex-col items-center text-center mb-8"
      >
        <div className="flex items-center gap-4 mb-3 mt-4 lg:mt-0">
          <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500 ring-1 ring-indigo-500/20 shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)]">
            <Hexagon className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">BIW DTM Checker</h1>
        </div>
        <p className="text-zinc-400 font-bold tracking-widest uppercase text-[10px] md:text-xs">
          Stellantis Door Standards
        </p>
      </motion.div>

      <div className="w-full max-w-[1400px] flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          
          {/* STATE 1 - Empty */}
          {isStateEmpty && (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col items-center justify-center mt-6 lg:-mt-10"
            >
              <DropZone onUploadComplete={handleUploadComplete} onError={setErrorMsg} />
              
              {errorMsg && (
                <div className="mt-8">
                  <ErrorAlert message={errorMsg} onRetry={resetState} />
                </div>
              )}
              
              <div className="mt-16 md:mt-24 flex flex-wrap justify-center gap-3 md:gap-5 opacity-40 hover:opacity-100 transition-opacity duration-500">
                <Badge variant="outline" className="bg-zinc-900/50 border-zinc-800 text-zinc-300 py-1 md:py-1.5 px-2 md:px-3"><Box className="w-3.5 h-3.5 mr-2 text-blue-400" /> FastAPI</Badge>
                <Badge variant="outline" className="bg-zinc-900/50 border-zinc-800 text-zinc-300 py-1 md:py-1.5 px-2 md:px-3"><Layers className="w-3.5 h-3.5 mr-2 text-yellow-500" /> pythonocc</Badge>
                <Badge variant="outline" className="bg-zinc-900/50 border-zinc-800 text-zinc-300 py-1 md:py-1.5 px-2 md:px-3"><Hexagon className="w-3.5 h-3.5 mr-2 text-green-400" /> Three.js</Badge>
                <Badge variant="outline" className="bg-zinc-900/50 border-zinc-800 text-zinc-300 py-1 md:py-1.5 px-2 md:px-3"><Cpu className="w-3.5 h-3.5 mr-2 text-indigo-400" /> Llama 3.2</Badge>
              </div>
            </motion.div>
          )}

          {/* STATE 2 - Processing */}
          {isStateProcessing && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-8 w-full"
            >
              <UploadProgress 
                filename={job?.filename || "Loading..."}
                isUploading={false}
                isProcessing={true}
                progress={100} 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 w-full h-[50vh] md:h-[600px] pointer-events-none">
                <div className="md:col-span-1 lg:col-span-7 bg-zinc-900/20 rounded-xl border border-zinc-800/50 flex items-center justify-center overflow-hidden relative backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent w-full h-[15%] animate-[bounce_4s_infinite]" />
                  <Box className="w-20 h-20 text-zinc-800 animate-pulse" />
                </div>
                
                <div className="hidden md:flex md:col-span-1 lg:col-span-5 bg-zinc-900/20 rounded-xl border border-zinc-800/50 p-8 flex-col gap-6 backdrop-blur-sm">
                  <div className="w-40 h-8 bg-zinc-800/30 rounded-md animate-pulse" />
                  <div className="w-full h-28 bg-zinc-800/30 rounded-xl animate-pulse" />
                  <div className="w-full h-28 bg-zinc-800/30 rounded-xl animate-pulse" />
                  <div className="w-full h-28 bg-zinc-800/30 rounded-xl animate-pulse mt-auto" />
                </div>
              </div>
            </motion.div>
          )}

          {/* STATE 3 - Complete */}
          {isStateComplete && job?.result?.dtm_report && (
            <motion.div 
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 w-full"
            >
              <div className="md:col-span-1 lg:col-span-7 lg:sticky lg:top-10 h-[50vh] md:h-[600px] lg:h-[750px] z-10 flex flex-col relative">
                <CADViewer 
                  glbUrl={jobId ? getMeshUrl(jobId) : null} 
                  defects={defectCoordinates}
                  focusTarget={focusTarget}
                  onModelLoaded={() => {}}
                />
                
                {/* Mobile Drawer Trigger */}
                <div className="md:hidden absolute bottom-6 left-6 z-20">
                  <Drawer>
                    <DrawerTrigger>
                      <div className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-2xl shadow-indigo-500/20 transition-colors">
                        <Menu className="w-4 h-4 mr-2" />
                        View Results
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="h-[85vh] bg-[#0d0d14] border-zinc-800 flex flex-col p-0">
                      <div className="flex-1 overflow-y-auto px-4 pb-10 mt-6">
                        <DTMReport 
                          report={job.result.dtm_report} 
                          onFocusDefect={handleFocusDefect} 
                          onRequestAI={handleRequestAI}
                          isLoadingAI={isGeneratingAI}
                        />
                        {(aiReport || isGeneratingAI) && (
                          <AIReport report={aiReport} isLoading={isGeneratingAI} />
                        )}
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>
              
              <div className="hidden md:flex md:col-span-1 lg:col-span-5 flex-col pb-20">
                <DTMReport 
                  report={job.result.dtm_report} 
                  onFocusDefect={handleFocusDefect} 
                  onRequestAI={handleRequestAI}
                  isLoadingAI={isGeneratingAI}
                />
                
                {(aiReport || isGeneratingAI) && (
                  <AIReport report={aiReport} isLoading={isGeneratingAI} />
                )}
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {(pollError || job?.status === "FAILED") && !isStateEmpty && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-start justify-center pt-20 z-50"
            >
              <ErrorAlert 
                message={pollError || "An unexpected error occurred during geometry processing."} 
                onRetry={resetState} 
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
