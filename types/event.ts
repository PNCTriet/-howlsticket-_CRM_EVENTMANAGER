export interface Event {
  id: string;
  title: string;
  organization_id?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  [key: string]: unknown;
}
