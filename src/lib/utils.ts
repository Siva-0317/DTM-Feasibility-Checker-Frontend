import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMeasurement(value: number, unit: string): string {
  return `${value.toFixed(2)} ${unit}`
}

export function getSeverityColor(severity: string): string {
  switch (severity.toUpperCase()) {
    case 'HIGH': return 'text-red-500 bg-red-500/10'
    case 'MEDIUM': return 'text-amber-500 bg-amber-500/10'
    case 'LOW': return 'text-blue-500 bg-blue-500/10'
    default: return 'text-zinc-500 bg-zinc-500/10'
  }
}

export function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'PASS': return 'text-green-500 bg-green-500/10 border-green-500/20'
    case 'FAIL': return 'text-red-500 bg-red-500/10 border-red-500/20'
    case 'WARN': return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20'
  }
}
