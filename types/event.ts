export interface Event {
  id: string;
  title: string;
  organization_id?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  image_url?: string;
  cover_image_url?: string;
  [key: string]: unknown;
}
