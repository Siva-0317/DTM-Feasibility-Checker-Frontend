export type JobStatus = "PENDING" | "PROCESSING" | "COMPLETE" | "FAILED";

export interface DTMRuleResult {
  rule_id: string;
  rule_name: string;
  status: "PASS" | "FAIL" | "WARN";
  measured_value: number;
  threshold: number;
  unit: string;
  defect_coordinates: [number, number, number][];
  severity: string;
  description: string;
}

export interface DTMReport {
  job_id: string;
  door_type: string;
  rules: DTMRuleResult[];
  overall_status: string;
  pass_count: number;
  fail_count: number;
  timestamp: string;
}

export interface Job {
  id: string;
  filename: string;
  door_type: string;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  result?: {
    dtm_report: DTMReport;
  };
}

export interface UploadResponse {
  job_id: string;
  status: string;
  message: string;
}

export interface RemediationReport {
  job_id: string;
  ai_advice: string;
  failed_rules_summary: any[];
  generated_at: string;
}
