import { useEffect, useState } from "react";
import { RemediationReport } from "../../lib/types";
import { BrainCircuit, Copy, CheckCircle2, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface AIReportProps {
  report: RemediationReport | null;
  isLoading: boolean;
}

const LOADING_MESSAGES = [
  "Analyzing failure patterns...",
  "Consulting Stellantis DTM standards...",
  "Running generative models...",
  "Drafting engineering remediation plan..."
];

export function AIReport({ report, isLoading }: AIReportProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 bg-[#0d0d14] rounded-xl border border-indigo-900/40 shadow-[0_0_40px_-15px_rgba(79,70,229,0.15)] animate-pulse">
        <BrainCircuit className="w-12 h-12 text-indigo-500 mb-6 animate-bounce" />
        <p className="text-zinc-300 font-medium tracking-wide">{LOADING_MESSAGES[msgIndex]}</p>
      </div>
    );
  }

  if (!report) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(report.ai_advice);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([report.ai_advice], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DTM_Remediation_${report.job_id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col bg-[#0d0d14] rounded-xl border border-indigo-900/60 shadow-[0_0_40px_-15px_rgba(79,70,229,0.25)] overflow-hidden mt-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
      <div className="flex items-center justify-between p-5 border-b border-indigo-900/50 bg-indigo-950/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-900/30 rounded-lg">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="font-bold text-indigo-100 text-lg tracking-tight">AI Remediation Report</h3>
        </div>
        <span className="text-xs text-indigo-400/60 font-mono tracking-widest">
          {new Date(report.generated_at).toLocaleTimeString()}
        </span>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-[#0a1a0a] rounded-xl p-5 border border-green-900/30 shadow-inner overflow-y-auto max-h-[350px]">
          <pre className="text-green-400/90 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {report.ai_advice}
          </pre>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase text-zinc-500 tracking-widest">Rules Targeted</h4>
          <div className="flex flex-wrap gap-2">
            {report.failed_rules_summary.map((ruleItem, idx) => {
              const text = typeof ruleItem === 'string' ? ruleItem : `${ruleItem.rule} (${ruleItem.fix_priority})`;
              return (
                <Badge key={idx} variant="outline" className="bg-zinc-900/80 border-zinc-700 text-zinc-300 py-1">
                  {text}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <Button 
            variant="outline" 
            onClick={handleCopy}
            className="flex-1 h-11 border-indigo-900/50 text-indigo-300 bg-indigo-950/10 hover:bg-indigo-950/50 hover:text-indigo-200 transition-colors font-semibold"
          >
            {copied ? (
              <><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Copied</>
            ) : (
              <><Copy className="w-4 h-4 mr-2 opacity-70" /> Copy</>
            )}
          </Button>

          <Button 
            variant="outline" 
            onClick={handleDownload}
            className="flex-1 h-11 border-indigo-900/50 text-indigo-300 bg-indigo-950/10 hover:bg-indigo-950/50 hover:text-indigo-200 transition-colors font-semibold"
          >
            <Download className="w-4 h-4 mr-2 opacity-70" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
