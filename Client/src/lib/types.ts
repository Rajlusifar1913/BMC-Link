// ─── Shared TypeScript Interfaces ─────────────────────────────────────────────

// ── Enums mirroring backend Prisma schema ────────────────────────────────────

export type LinkType =
  | "WEBSITE"
  | "YOUTUBE"
  | "INSTAGRAM"
  | "FACEBOOK"
  | "TWITTER"
  | "GITHUB"
  | "CUSTOM";

export type UserRole = "CREATOR" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED" | "DELETED";

// ── Models ────────────────────────────────────────────────────────────────────

export interface Theme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  username: string;
  headline: string | null;
  bio: string | null;
  avatar: string | null;
  coverImage: string | null;
  website: string | null;
  accentColor: string | null;
  themeId: string | null;
  theme: Theme | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  profilePicture: string | null;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  timezone: string | null;
  language: string | null;
  lastLogin: string | null;
  creatorProfile: CreatorProfile | null;
  createdAt: string;
  updatedAt: string;
}

export interface Link {
  id: string;
  creatorId: string;
  title: string | null;
  url: string;
  type: LinkType;
  icon: string | null;
  thumbnail: string | null;
  position: number | null;
  clickCount: number;
  isFeatured: boolean;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicProfile {
  id: string;
  username: string;
  headline: string | null;
  bio: string | null;
  avatar: string | null;
  coverImage: string | null;
  website: string | null;
  accentColor: string | null;
  theme: { id: string; name: string } | null;
  user: {
    name: string | null;
    profilePicture: string | null;
  };
}

// ── API Response Shapes ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ── Request Payloads ──────────────────────────────────────────────────────────

export interface UpdateProfilePayload {
  name?: string | null;
  phone?: string | null;
  profilePicture?: string | null;
  timezone?: string | null;
  language?: string | null;
  headline?: string | null;
  bio?: string | null;
  avatar?: string | null;
  coverImage?: string | null;
  website?: string | null;
  accentColor?: string | null;
  themeId?: string | null;
}

export interface CreateLinkPayload {
  title?: string | null;
  url: string;
  type: LinkType;
  icon?: string | null;
  thumbnail?: string | null;
  position?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface UpdateLinkPayload extends Partial<CreateLinkPayload> {}

export interface ReorderItem {
  id: string;
  position: number;
}

export interface GetLinksQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: "true" | "false";
  type?: LinkType;
  sortBy?: "title" | "createdAt" | "updatedAt" | "position" | "clickCount";
  order?: "asc" | "desc";
}

export interface CheckUsernameResult {
  username: string;
  available: boolean;
}
