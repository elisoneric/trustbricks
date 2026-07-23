export const ROLES = ["SUPER_ADMIN", "CSU_STAFF"] as const;
export type Role = (typeof ROLES)[number];

export const PROPERTY_CATEGORIES = ["RESIDENTIAL", "COMMERCIAL", "LAND"] as const;
export type PropertyCategory = (typeof PROPERTY_CATEGORIES)[number];

export const PROPERTY_STATUSES = ["AVAILABLE", "UNDER_OFFER", "SOLD"] as const;
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

export interface CoreValue {
  title: string;
  description: string;
  icon?: string;
}

export interface LeadershipMember {
  name: string;
  title: string;
  photoUrl?: string;
  bio?: string;
}
