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

export type PaymentStatus = "PENDING" | "SUCCESSFUL" | "FAILED" | "REFUNDED";
export type PaymentType =
  | "DONATION"
  | "MEMBERSHIP"
  | "PREMIUM_SUBSCRIPTION"
  | "PRODUCT_PURCHASE";

export type MembershipStatus = "ACTIVE" | "CANCELLED" | "EXPIRED";
export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type ProductVisibility = "PUBLIC" | "PRIVATE" | "UNLISTED";

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

export interface CreatorSettings {
  id: string;
  creatorId: string;
  allowDonations: boolean;
  allowMemberships: boolean;
  allowProducts: boolean;
  showEmail: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatorAnalytics {
  id?: string;
  creatorId?: string;
  totalProfileViews: number;
  totalLinkClicks: number;
  totalDonations: number | string;
  totalSales: number | string;
  totalRevenue: number | string;
  updatedAt?: string;
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
  creatorSettings?: CreatorSettings | null;
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
    isVerified?: boolean;
    creatorSettings?: CreatorSettings | null;
  };
}

export interface Donation {
  id: string;
  creatorId: string;
  paymentId: string;
  supporterId?: string | null;
  displayName?: string | null;
  email?: string | null;
  isAnonymous: boolean;
  message?: string | null;
  createdAt: string;
  payment?: {
    amount: number | string;
    currency: string;
    paymentStatus: PaymentStatus;
    createdAt?: string;
  };
}

export interface MembershipPlan {
  id: string;
  creatorId: string;
  name: string;
  description?: string | null;
  price: number | string;
  durationDays: number;
  isActive: boolean;
  createdAt: string;
}

export interface Membership {
  id: string;
  creatorId: string;
  planId: string;
  paymentId: string;
  memberId?: string | null;
  memberName?: string | null;
  memberEmail?: string | null;
  status: MembershipStatus;
  startDate?: string | null;
  endDate?: string | null;
  subscriptionId?: string | null;
  createdAt: string;
  updatedAt: string;
  plan?: MembershipPlan;
  creator?: {
    creatorProfile?: {
      username: string;
    };
  };
}

export interface DigitalProduct {
  id: string;
  creatorId: string;
  title: string;
  description?: string | null;
  price: number | string;
  fileUrl?: string | null;
  thumbnail?: string | null;
  slug: string;
  categoryId?: string | null;
  visibility: ProductVisibility;
  previewUrl?: string | null;
  downloadLimit?: number | null;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags?: {
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
  creator?: {
    creatorProfile?: {
      username: string;
    };
  };
}

export interface Purchase {
  id: string;
  productId: string;
  paymentId: string;
  buyerName?: string | null;
  buyerEmail?: string | null;
  buyerId?: string | null;
  downloadCount: number;
  downloadLimit?: number | null;
  licenseKey?: string | null;
  expiresAt?: string | null;
  purchasedAt: string;
  product?: {
    id: string;
    title: string;
    slug: string;
    thumbnail?: string | null;
    price?: number | string;
    fileUrl?: string | null;
  };
  payment?: {
    amount: number | string;
    currency: string;
    paymentStatus: PaymentStatus;
    createdAt: string;
  };
}

export interface PaymentOrderResult {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

// ── Admin Models ──────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  createdAt: string;
  creatorProfile?: {
    username: string;
  } | null;
}

export interface AdminCreator {
  id: string;
  userId: string;
  username: string;
  headline: string | null;
  avatar: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    status: UserStatus;
    createdAt: string;
  };
}

export interface AdminReport {
  id: string;
  userId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  oldData: unknown;
  newData: unknown;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  user?: {
    email: string;
    name: string | null;
  } | null;
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

export interface UpdateSettingsPayload {
  allowDonations?: boolean;
  allowMemberships?: boolean;
  allowProducts?: boolean;
  showEmail?: boolean;
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

export interface CreateDonationPayload {
  username: string;
  amount: number;
  name?: string;
  email?: string;
  message?: string;
  isAnonymous?: boolean;
}

export interface VerifyPaymentPayload {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface CreatePlanPayload {
  name: string;
  description?: string | null;
  price: number;
  durationDays: number;
  isActive?: boolean;
}

export interface UpdatePlanPayload extends Partial<CreatePlanPayload> {}

export interface SubscribePlanPayload {
  planId: string;
  memberName?: string;
  memberEmail?: string;
}

export interface CreateProductPayload {
  title: string;
  description?: string | null;
  price: number;
  categoryId?: string | null;
  tagIds?: string[];
  thumbnail?: string | null;
  previewUrl?: string | null;
  visibility?: ProductVisibility;
  downloadLimit?: number | null;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}

export interface CreatePurchasePayload {
  productId: string;
  buyerName?: string;
  buyerEmail?: string;
}

export interface GetUsersAdminQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface GetCreatorsAdminQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface GetReportsAdminQuery {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  entity?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}
