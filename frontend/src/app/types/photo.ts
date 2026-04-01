export type PhotoStatus = "uploading" | "processing" | "ready" | "completed";

export interface PhotoData {
  id: string;
  image: string;
  keywords: string;
  status: PhotoStatus;
  essay?: string;
}