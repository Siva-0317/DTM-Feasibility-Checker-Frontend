import axios from "axios";
import { Job, RemediationReport, UploadResponse } from "./types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 300000, // 5 minutes to accommodate large CAD uploads and LLM generation
  headers: {
    "Content-Type": "application/json",
  },
});

export async function uploadCADFile(file: File, doorType: "front" | "rear"): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("door_type", doorType);

  const response = await api.post<UploadResponse>("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
}

export async function getJobStatus(jobId: string): Promise<Job> {
  const response = await api.get<Job>(`/api/analysis/${jobId}`);
  return response.data;
}

export async function getRemediationReport(jobId: string): Promise<RemediationReport> {
  const response = await api.post<RemediationReport>("/api/remediation", { job_id: jobId });
  return response.data;
}

export function getMeshUrl(jobId: string): string {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return `${baseURL}/api/analysis/${jobId}/mesh`;
}
