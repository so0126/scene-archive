import { STORAGE_KEYS } from "./constants";
import type { PhotoData } from "../types/photo";

export function savePhotos(photos: PhotoData[]) {
  sessionStorage.setItem(STORAGE_KEYS.photos, JSON.stringify(photos));
}

export function loadPhotos(): PhotoData[] {
  const raw = sessionStorage.getItem(STORAGE_KEYS.photos);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function clearFlowStorage() {
  sessionStorage.removeItem(STORAGE_KEYS.photos);
  sessionStorage.removeItem(STORAGE_KEYS.order);
}