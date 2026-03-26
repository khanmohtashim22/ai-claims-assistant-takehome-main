import type { Claim, UrgencyLevel } from "@/types"
import { loadClaims } from "@/lib/claims"

function parseUrgency(value: string | null): UrgencyLevel | null {
  if (!value) return null
  if (value === "critical" || value === "high" || value === "normal") return value
  return null
}

function sortByDeadlineAscNullsLast(a: Claim, b: Claim) {
  const aVal = a.daysUntilDeadline ?? Number.POSITIVE_INFINITY
  const bVal = b.daysUntilDeadline ?? Number.POSITIVE_INFINITY
  return aVal - bVal
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const urgencyParam = url.searchParams.get("urgency")

  const urgency = parseUrgency(urgencyParam)
  if (urgencyParam && !urgency) {
    return new Response(
      JSON.stringify({
        error: "Invalid urgency. Expected one of: critical, high, normal.",
      }),
      { status: 400, headers: { "content-type": "application/json" } },
    )
  }

  const claims = loadClaims()
  const filtered = urgency ? claims.filter((c) => c.urgency === urgency) : claims

  filtered.sort(sortByDeadlineAscNullsLast)

  return new Response(JSON.stringify({ claims: filtered }), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
}

