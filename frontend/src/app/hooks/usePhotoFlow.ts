import { useState } from "react";
import type { PhotoData } from "../types/photo";

export function usePhotoFlow() {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const newPhoto: PhotoData = {
          id: Date.now().toString() + Math.random(),
          image: event.target?.result as string,
          keywords: "",
          processing: true,
          processed: false,
        };

        setPhotos((prev) => {
          const updatedPhotos = [...prev, newPhoto];

          setTimeout(() => {
            setPhotos((current) =>
              current.map((photo) =>
                photo.id === newPhoto.id
                  ? { ...photo, processing: false, processed: true }
                  : photo
              )
            );
          }, 2000);

          return updatedPhotos;
        });
      };

      reader.readAsDataURL(file);
    });
  };

  const handleKeywordChange = (value: string) => {
    setPhotos((prev) =>
      prev.map((photo, index) =>
        index === currentIndex ? { ...photo, keywords: value } : photo
      )
    );
  };

  const handleDeletePhoto = (indexToDelete: number) => {
    setPhotos((prev) => prev.filter((_, index) => index !== indexToDelete));

    setCurrentIndex((prev) => {
      if (prev === 0) return 0;
      if (indexToDelete <= prev) return prev - 1;
      return prev;
    });
  };

  const currentPhoto = photos[currentIndex];

  const canProceed =
    photos.length > 0 &&
    photos.every((p) => p.processed && p.keywords.trim() !== "");

  return {
    photos,
    currentIndex,
    currentPhoto,
    setCurrentIndex,
    handleImageUpload,
    handleKeywordChange,
    handleDeletePhoto,
    canProceed,
  };
}