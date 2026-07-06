/**
 * pfa-rules.ts — Shared PFA threshold data used by both:
 *   - EligibilityFunnel.tsx (client component)
 *   - leadRouting.ts (server action)
 *
 * Keeping this separate prevents circular server←→client imports.
 */

export type BranchSlug = "abuja" | "lagos" | "adamawa" | "kaduna";

export type PfaSlug =
  | "stanbic-ibtc"
  | "gt-pension"
  | "citizens-tier-1"
  | "citizens-tier-2"
  | "trustfund"
  | "nupemco"
  | "tangerine-apt"
  | "norrenberger"
  | "nlpc"
  | "premium"
  | "accessarm"
  | "leadway-pensure"
  | "oak";

export interface PfaRule {
  slug: PfaSlug;
  name: string;
  minBalance: number;
}

export const PFA_RULES: Record<PfaSlug, PfaRule> = {
  "stanbic-ibtc":    { slug: "stanbic-ibtc",    name: "Stanbic IBTC Nominees",      minBalance: 5_000_000 },
  "gt-pension":      { slug: "gt-pension",       name: "GT Pension",                 minBalance: 1_000_000 },
  "citizens-tier-1": { slug: "citizens-tier-1",  name: "Citizens Pensions (Tier 1)", minBalance:   500_000 },
  "citizens-tier-2": { slug: "citizens-tier-2",  name: "Citizens Pensions (Tier 2)", minBalance:   200_000 },
  "trustfund":       { slug: "trustfund",        name: "Trustfund Pensions",         minBalance:   500_000 },
  "nupemco":         { slug: "nupemco",          name: "NUPEMCO",                    minBalance:   500_000 },
  "tangerine-apt":   { slug: "tangerine-apt",    name: "Tangerine APT",              minBalance:   500_000 },
  "norrenberger":    { slug: "norrenberger",     name: "Norrenberger",               minBalance:   500_000 },
  "nlpc":            { slug: "nlpc",             name: "NLPC Pensions",              minBalance:   500_000 },
  "premium":         { slug: "premium",          name: "Premium Pensions",           minBalance:   500_000 },
  "accessarm":       { slug: "accessarm",        name: "AccessARM Pensions",         minBalance:   500_000 },
  "leadway-pensure": { slug: "leadway-pensure",  name: "Leadway Pensure",            minBalance:   500_000 },
  "oak":             { slug: "oak",              name: "Oak Pensions",               minBalance:   500_000 },
};
