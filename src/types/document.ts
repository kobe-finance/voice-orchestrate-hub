
export interface DocumentVersion {
  id: string;
  date: string;
  notes: string;
}

export interface DocumentType {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  tags: string[];
  status: string;
  category: string;
  expirationDate: string;
  content: string;
  versions: DocumentVersion[];
}
