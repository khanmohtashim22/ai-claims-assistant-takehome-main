import type { RawClaim, UrgencyLevel } from "@/types"

const msPerDay = 24 * 60 * 60 * 1000

function urgencyFromDays(daysUntilDeadline: number | null): UrgencyLevel {
  if (daysUntilDeadline === null) return "normal"
  if (daysUntilDeadline <= 3) return "critical"
  if (daysUntilDeadline <= 7) return "high"
  return "normal"
}

function deadlinePts(daysUntilDeadline: number | null): number {
  if (daysUntilDeadline === null) return 0
  if (daysUntilDeadline <= 3) return 100
  if (daysUntilDeadline <= 7) return 80
  if (daysUntilDeadline <= 14) return 60
  if (daysUntilDeadline <= 30) return 40
  return 20
}

export function computeDaysUntilFilingDeadline(claim: RawClaim): number | null {
  // TODAY's reference date must be computed at runtime.
  const now = new Date()

  if (!claim.filingDeadline) return null

  const deadlineMs = Date.parse(`${claim.filingDeadline}T00:00:00.000Z`)
  if (Number.isNaN(deadlineMs)) return null

  return Math.floor((deadlineMs - now.getTime()) / msPerDay)
}

export function computePriority(
  claim: RawClaim,
): { priorityScore: number; urgency: UrgencyLevel; daysUntilDeadline: number | null } {
  const daysUntilDeadline = computeDaysUntilFilingDeadline(claim)
  const score = deadlinePts(daysUntilDeadline)
  const urgency = urgencyFromDays(daysUntilDeadline)

  return { priorityScore: score, urgency, daysUntilDeadline }
}

