import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMeasurement(value: number | null | undefined, unit: string): string {
  if (value === null || value === undefined || isNaN(value as number)) return `N/A`;
  return `${Number(value).toFixed(2)} ${unit}`
}

export function getStatusColor(status?: string): string {
  if (!status) return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20'
  switch (status.toUpperCase()) {
    case 'PASS': return 'text-green-500 bg-green-500/10 border-green-500/20'
    case 'FAIL': return 'text-red-500 bg-red-500/10 border-red-500/20'
    case 'WARN': return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20'
  }
}

export function getSeverityColor(severity?: string): string {
  if (!severity) return 'text-zinc-500 border-zinc-500/20 bg-zinc-500/5'
  switch (severity.toUpperCase()) {
    case 'HIGH': return 'text-red-500 border-red-500/20 bg-red-500/5'
    case 'MEDIUM': return 'text-amber-500 border-amber-500/20 bg-amber-500/5'
    case 'LOW': return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'
    default: return 'text-zinc-500 border-zinc-500/20 bg-zinc-500/5'
  }
}
