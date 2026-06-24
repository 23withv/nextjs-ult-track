export interface LetterListItem {
  _id: string;
  targetUnit: string;
  type: string;
  status: string;
  createdAt: string;
  documentUrl?: string;
  adminNotes?: string;
  delegateInfo?: { nim: string; name: string } | null;
}