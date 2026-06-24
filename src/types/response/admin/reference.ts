export interface ReferenceItem {
  _id: string;
  name: string;
  isDeleted: boolean;
  createdAt: string;
}

export interface ReferenceResponse {
  message: string;
  data: ReferenceItem[];
}