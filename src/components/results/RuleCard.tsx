import { DTMRuleResult } from "../../lib/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { cn, formatMeasurement, getStatusColor, getSeverityColor } from "../../lib/utils";

interface RuleCardProps {
  rule: DTMRuleResult;
  onFocusDefect: (coords: [number, number, number][]) => void;
  index: number;
}

export function RuleCard({ rule, onFocusDefect, index }: RuleCardProps) {
  const isFail = rule.status === "FAIL";

  return (
    <div 
      className={cn(
        "flex flex-col p-5 rounded-xl border bg-card hover:border-zinc-500 transition-all duration-300 animate-in slide-in-from-right-8 fade-in",
        rule.status === "PASS" ? "border-zinc-800" : isFail ? "border-red-900/50 bg-red-950/10" : "border-amber-900/50 bg-amber-950/10"
      )}
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-zinc-900 w-max px-2 py-0.5 rounded-full">
            Rule {rule.rule_id}
          </span>
          <h4 className="text-sm font-semibold text-foreground leading-snug">{rule.rule_name}</h4>
        </div>
        <Badge className={cn("shrink-0 uppercase font-bold tracking-wider text-[10px] px-2 py-0.5", getStatusColor(rule.status))}>
          {rule.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5 mt-auto">
        <div className="flex flex-col p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 shadow-inner">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Measured</span>
          <span className="text-sm font-mono font-medium text-zinc-200">{formatMeasurement(rule.measured_value, rule.unit)}</span>
        </div>
        <div className="flex flex-col p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 shadow-inner">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Limit</span>
          <span className="text-sm font-mono font-medium text-zinc-200">{formatMeasurement(rule.threshold, rule.unit)}</span>
        </div>
      </div>

      {isFail && (
        <div className="mt-auto space-y-3">
          <div className={cn("flex items-start gap-2 p-2.5 rounded-lg text-xs font-medium border", getSeverityColor(rule.severity))}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed"><strong className="font-bold">{rule.severity} SEVERITY</strong> &mdash; {rule.description}</span>
          </div>
          
          {rule.defect_coordinates && rule.defect_coordinates.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-between hover:bg-zinc-800 text-xs font-medium border-zinc-700 bg-zinc-900"
              onClick={() => onFocusDefect(rule.defect_coordinates)}
            >
              Focus in 3D
              <ArrowRight className="w-3 h-3 ml-2 text-zinc-500" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
