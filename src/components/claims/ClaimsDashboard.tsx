"use client"

import { useEffect, useMemo, useState } from "react"
import type { Claim, UrgencyLevel } from "@/types"

const URGENCY_OPTIONS: Array<{ value: UrgencyLevel; label: string }> = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "normal", label: "Normal" },
]

function formatMoney(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return "—"
  return `$${amount.toFixed(2)}`
}

function formatDate(date: string | null | undefined) {
  if (!date) return "—"
  return date
}

export default function ClaimsDashboard() {
  const [urgency, setUrgency] = useState<UrgencyLevel>("critical")
  const [claims, setClaims] = useState<Claim[]>([])
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    fetch(`/api/claims?urgency=${urgency}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => null)
          throw new Error(body?.error ?? `Request failed (${res.status})`)
        }
        return (await res.json()) as { claims: Claim[] }
      })
      .then((data) => {
        if (cancelled) return
        setClaims(data.claims ?? [])
        setHasLoaded(true)
      })
      .catch((err) => {
        if (cancelled) return
        console.error(err)
        setClaims([])
        setHasLoaded(true)
      })

    return () => {
      cancelled = true
    }
  }, [urgency])

  const selectedClaim = useMemo(() => {
    if (!selectedClaimId) return null
    return claims.find((c) => c.claimId === selectedClaimId) ?? null
  }, [claims, selectedClaimId])

  return (
    <div className="h-screen w-full overflow-hidden bg-white text-foreground">
      <div className="flex h-full w-full">
        <aside className="flex w-2/5 flex-col border-r border-border">
          <div className="p-4">
            <label className="text-sm font-medium text-muted-foreground" htmlFor="urgency">
              Urgency
            </label>
            <select
              id="urgency"
              value={urgency}
              onChange={(e) => {
                setSelectedClaimId(null)
                setHasLoaded(false)
                setUrgency(e.target.value as UrgencyLevel)
              }}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              {URGENCY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-3">
            {!hasLoaded ? (
              <div className="p-2 text-sm text-muted-foreground">Loading queue...</div>
            ) : claims.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">No claims found.</div>
            ) : (
              <div className="flex flex-col gap-2">
                {claims.map((claim) => {
                  const isSelected = claim.claimId === selectedClaimId
                  const days = claim.daysUntilDeadline

                  return (
                    <button
                      key={claim.claimId}
                      type="button"
                      onClick={() => setSelectedClaimId(claim.claimId)}
                      className={[
                        "w-full rounded-lg border px-3 py-2 text-left transition-colors",
                        "hover:bg-muted/50",
                        isSelected
                          ? "border-zinc-900 bg-muted/60"
                          : "border-border bg-background",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">{claim.claimId}</div>
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            {claim.payer.name} • {claim.status}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div
                            className={[
                              "text-xs font-medium",
                              claim.urgency === "critical"
                                ? "text-red-700"
                                : claim.urgency === "high"
                                  ? "text-amber-700"
                                  : "text-zinc-700",
                            ].join(" ")}
                          >
                            {claim.urgency}
                          </div>
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            {days === null ? "Deadline —" : `${days}d`}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </aside>

        <section className="w-3/5 h-full overflow-y-auto p-4">
          {selectedClaim ? (
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">{selectedClaim.claimId}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {selectedClaim.payer.name} • {selectedClaim.status} • {selectedClaim.urgency} urgency
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {selectedClaim.daysUntilDeadline === null
                      ? "Deadline: —"
                      : `Due in: ${selectedClaim.daysUntilDeadline} days`}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Filing deadline: {formatDate(selectedClaim.filingDeadline)}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold">Patient</div>
                  <div className="mt-1 text-sm">{selectedClaim.patient.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    DOB: {formatDate(selectedClaim.patient.dateOfBirth)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Member ID: {selectedClaim.patient.memberId}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold">Provider</div>
                  <div className="mt-1 text-sm">{selectedClaim.provider.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    NPI: {selectedClaim.provider.npi}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Specialty: {selectedClaim.provider.specialty}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Facility: {selectedClaim.provider.facility}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold">Dates</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Date of service: {formatDate(selectedClaim.dateOfService)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Date submitted: {formatDate(selectedClaim.dateSubmitted)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold">Amounts</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Billed: {formatMoney(selectedClaim.totalBilledAmount)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Paid: {formatMoney(selectedClaim.totalPaidAmount)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Allowed: {selectedClaim.totalAllowedAmount === null ? "—" : formatMoney(selectedClaim.totalAllowedAmount)}
                  </div>
                </div>
              </div>

              {selectedClaim.denialReason || selectedClaim.denialCode || selectedClaim.payerNotes ? (
                <div className="mt-4">
                  <div className="text-sm font-semibold">Denial / Notes</div>
                  {selectedClaim.denialCode ? (
                    <div className="mt-1 text-xs text-muted-foreground">
                      Denial code: {selectedClaim.denialCode}
                    </div>
                  ) : null}
                  {selectedClaim.denialReason ? (
                    <div className="mt-1 text-sm">{selectedClaim.denialReason}</div>
                  ) : null}
                  {selectedClaim.payerNotes ? (
                    <div className="mt-2 whitespace-pre-wrap text-sm text-foreground">
                      {selectedClaim.payerNotes}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {selectedClaim.priorActions.length > 0 ? (
                <div className="mt-4">
                  <div className="text-sm font-semibold">Prior Actions</div>
                  <div className="mt-2 flex flex-col gap-2">
                    {selectedClaim.priorActions.map((a, idx) => (
                      <div
                        key={`${a.date}-${idx}`}
                        className="rounded-md border border-border p-2"
                      >
                        <div className="text-xs text-muted-foreground">
                          {a.date} • {a.type} • outcome: {a.outcome}
                        </div>
                        <div className="mt-1 text-sm">{a.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-4">
                <div className="text-sm font-semibold">Line Items</div>
                <div className="mt-2 flex flex-col gap-2">
                  {selectedClaim.lineItems.map((li, idx) => (
                    <div
                      key={`${li.cptCode}-${idx}`}
                      className="rounded-md border border-border p-2"
                    >
                      <div className="text-sm font-medium">
                        {li.cptCode}
                        {li.modifier ? <span className="ml-2 text-xs text-muted-foreground">mod: {li.modifier}</span> : null}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{li.description}</div>
                      <div className="mt-2 grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                        <div>Units: {li.units}</div>
                        <div>Billed: {formatMoney(li.billedAmount)}</div>
                        <div>Paid: {formatMoney(li.paidAmount)}</div>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Allowed: {li.allowedAmount === null ? "—" : formatMoney(li.allowedAmount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Click a claim to view details.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

