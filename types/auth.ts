export type UserRole = "USER" | "ADMIN_ORGANIZER" | "OWNER_ORGANIZER" | "SUPERADMIN";

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_verified?: boolean;
  phone?: string;
  avatar_url?: string;
}

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  /** Backend có thể trả snake_case */
  access_token?: string;
  refresh_token?: string;
  user?: AuthUser;
}

export interface MeResponse {
  authenticated: boolean;
  user?: AuthUser;
  message?: string;
}
