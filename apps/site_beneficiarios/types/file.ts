export interface File {
  ID: string;
  file_name?: string | null;
  created: string;
  updated?: null;
  batch_id: string;
  status: string;
  metadata?: string | null;
  data?: null;
  author: string;
  error: string;
}
