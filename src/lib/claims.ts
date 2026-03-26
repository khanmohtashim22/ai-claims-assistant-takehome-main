import type { Claim, RawClaim } from "@/types"
import rawClaimsJson from "../../claims.json"
import { computePriority } from "./priority"

const rawClaims: RawClaim[] = rawClaimsJson as unknown as RawClaim[]

export function loadRawClaims(): RawClaim[] {
  return rawClaims
}

export function loadClaims(): Claim[] {
  return rawClaims.map((claim) => {
    const priority = computePriority(claim)
    return {
      ...claim,
      ...priority,
    }
  })
}

