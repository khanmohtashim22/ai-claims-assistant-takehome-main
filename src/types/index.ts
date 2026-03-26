export type ClaimStatus =
  | 'denied'
  | 'rejected'
  | 'pending'
  | 'underpaid'
  | 'appealed'
  | 'written_off'
  | 'escalated'

export type UrgencyLevel = 'critical' | 'high' | 'normal'

export interface LineItem {
  cptCode: string
  description: string
  modifier?: string
  units: number
  billedAmount: number
  allowedAmount: number | null
  paidAmount: number
}

export interface PriorAction {
  date: string
  type: string
  description: string
  outcome: string
}

export interface RawClaim {
  claimId: string
  patient: { name: string; dateOfBirth: string; memberId: string }
  provider: { name: string; npi: string; specialty: string; facility: string }
  payer: { name: string; payerId: string }
  dateOfService: string
  dateSubmitted: string
  lineItems: LineItem[]
  totalBilledAmount: number
  totalAllowedAmount: number | null
  totalPaidAmount: number
  status: ClaimStatus
  denialReason: string | null
  denialCode: string | null
  payerNotes: string
  priorActions: PriorAction[]
  filingDeadline: string | null
}

export interface Claim extends RawClaim {
  priorityScore: number
  urgency: UrgencyLevel
  daysUntilDeadline: number | null
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  toolCall?: { name: string; status: 'executing' | 'done' }
  pendingAction?: PendingAction
  timestamp: Date
}

export type PendingAction =
  | { type: 'status_change'; claimId: string; newStatus: ClaimStatus; note: string }
  | { type: 'appeal_draft'; claimId: string; letter: string }
