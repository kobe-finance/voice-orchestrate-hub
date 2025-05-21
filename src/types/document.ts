
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
  priority?: string;
  expirationDate: string;
  content: string;
  versions: DocumentVersion[];
}

export interface CategoryType {
  id: string;
  name: string;
  parentId: string | null;
  priority: 'high' | 'medium' | 'low';
  children: CategoryType[];
}
