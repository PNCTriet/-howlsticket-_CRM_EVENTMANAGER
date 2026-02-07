export interface Organization {
  id: string;
  name?: string;
  avatar_url?: string;
  image_url?: string;
  logo_url?: string;
  [key: string]: unknown;
}
