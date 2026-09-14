import { DTMReport as DTMReportType } from "../../lib/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { RuleCard } from "./RuleCard";
import { Loader2, BrainCircuit, CheckCircle2 } from "lucide-react";
import { cn, getStatusColor } from "../../lib/utils";

interface DTMReportProps {
  report: DTMReportType;
  onFocusDefect: (coords: [number, number, number][]) => void;
  onRequestAI: () => void;
  isLoadingAI: boolean;
}

export function DTMReport({ report, onFocusDefect, onRequestAI, isLoadingAI }: DTMReportProps) {
  const isPass = report.overall_status === "PASS";
  const rules = report.rules || [];
  const failedRules = rules.filter(r => r.status === "FAIL" || r.status === "WARN");

  return (
    <div className="flex flex-col h-full bg-[#0d0d14] rounded-xl border border-zinc-800 shadow-xl overflow-hidden animate-in fade-in duration-500">
      {/* Top summary bar */}
      <div className="p-6 border-b border-zinc-800 bg-zinc-900/40 backdrop-blur-md">
        <div className="flex justify-between items-start mb-5">
          <div>
            <Badge variant="outline" className="mb-3 bg-zinc-800/80 text-zinc-300 border-zinc-700 uppercase tracking-widest text-[10px]">
              {report.door_type} Door
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-100">Analysis Complete</h2>
            <p className="text-sm font-mono text-muted-foreground mt-2 opacity-70">
              {new Date(report.timestamp).toLocaleString()}
            </p>
          </div>
          <Badge className={cn("text-lg px-4 py-1.5 font-bold shadow-lg", getStatusColor(report.overall_status))}>
            {report.overall_status}
          </Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2.5 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
            <div 
              className={cn("h-full transition-all duration-1000 ease-out", isPass ? "bg-green-500" : "bg-red-500")} 
              style={{ width: `${(report.pass_count / Math.max(1, rules.length)) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold tracking-wide text-zinc-300 whitespace-nowrap">
            {report.pass_count} / {rules.length} Passed
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full mb-6 bg-zinc-900/70 border border-zinc-800 h-12 p-1">
            <TabsTrigger value="all" className="flex-1 h-full rounded-md font-medium text-sm data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
              DTM Rules ({rules.length})
            </TabsTrigger>
            <TabsTrigger value="failures" className="flex-1 h-full rounded-md font-medium text-sm data-[state=active]:bg-zinc-800 data-[state=active]:text-red-400">
              Failures Only ({failedRules.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0 outline-none">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {rules.map((rule, idx) => (
                <RuleCard 
                  key={rule.rule_id} 
                  rule={rule} 
                  index={idx}
                  onFocusDefect={onFocusDefect} 
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="failures" className="mt-0 outline-none">
            {failedRules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center animate-in zoom-in-95 duration-500">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-5 ring-1 ring-green-500/30">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-zinc-100">Perfect Compliance</h3>
                <p className="text-sm text-zinc-400 max-w-sm mt-2 leading-relaxed">No DTM rules failed. The door geometry completely meets all Stellantis engineering standards.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {failedRules.map((rule, idx) => (
                  <RuleCard 
                    key={rule.rule_id} 
                    rule={rule} 
                    index={idx}
                    onFocusDefect={onFocusDefect} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {!isPass && (
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/60 backdrop-blur-sm shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]">
          <Button 
            onClick={onRequestAI}
            disabled={isLoadingAI}
            className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/30 transition-all active:scale-[0.98]"
          >
            {isLoadingAI ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin text-indigo-300" />
                Consulting AI Engineer...
              </>
            ) : (
              <>
                <BrainCircuit className="w-5 h-5 mr-3" />
                Generate AI Engineering Report
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
