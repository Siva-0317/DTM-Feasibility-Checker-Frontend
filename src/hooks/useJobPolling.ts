import { useEffect, useState } from "react";
import { getJobStatus } from "../lib/api";
import { Job } from "../lib/types";

export function useJobPolling(jobId: string | null) {
  const [job, setJob] = useState<Job | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) {
      setJob(null);
      setIsPolling(false);
      setError(null);
      return;
    }

    setIsPolling(true);
    setError(null);

    const pollJob = async () => {
      try {
        const currentJob = await getJobStatus(jobId);
        setJob(currentJob);

        if (currentJob.status === "COMPLETE") {
          setIsPolling(false);
        } else if (currentJob.status === "FAILED") {
          setIsPolling(false);
          setError("Job failed during processing.");
        }
      } catch (err: any) {
        console.error("Error polling job status:", err);
        setIsPolling(false);
        setError(err.message || "Failed to fetch job status.");
      }
    };

    // Initial check
    pollJob();

    const intervalId = setInterval(() => {
      setJob((prevJob) => {
        if (prevJob?.status === "COMPLETE" || prevJob?.status === "FAILED") {
          clearInterval(intervalId);
          return prevJob;
        }
        pollJob();
        return prevJob;
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, [jobId]);

  return { job, isPolling, error };
}
