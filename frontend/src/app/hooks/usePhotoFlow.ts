import { useState } from "react";
import { useBookStore } from "../store/useBookStore";
import type { PhotoData } from "../types/photo";

interface ServerUploadResponse {
  originalName: string;
  serverFileName: string;
}

export function usePhotoFlow() {
  const { bookUid } = useBookStore();
  const [photos, setPhotos] = useState<PhotoData[]>(() => {
    const saved = sessionStorage.getItem("photos");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !bookUid) return;
    const files = Array.from(e.target.files);

    // 1. [화면 업데이트] 사진 객체 생성 (사용자님 인터페이스 그대로!)
    const newPhotos: PhotoData[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      image: URL.createObjectURL(file),
      keywords: "",
      processing: true,
      processed: false,
      serverFileName: "",
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);

    // 2. [서버 전송] FormData 구성
    const formData = new FormData();
    formData.append("book_uid", bookUid);
    files.forEach((file) => formData.append("images", file));

    try {
      const response = await fetch("http://localhost:8000/api/photo/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json(); 

      if (result.status === "success") {
        const uploadedFiles: ServerUploadResponse[] = result.files;

        setPhotos((prev) =>
          prev.map((photo) => {
            if (photo.processed) return photo;

            const matched = uploadedFiles.find((f) => {
              return files.some(file => file.name === f.originalName);
            });

            return matched
              ? {
                  ...photo,
                  serverFileName: matched.serverFileName,
                  processing: false,
                  processed: true,
                }
              : photo;
          })
        );
      }
    } catch (err) {
      console.error("업로드 에러:", err);
      setPhotos((prev) => prev.map(p => ({ ...p, processing: false })));
    }
  };

  const handleKeywordChange = (value: string) => {
    setPhotos((prev) =>
      prev.map((photo, index) =>
        index === currentIndex ? { ...photo, keywords: value } : photo,
      ),
    );
  };

  const handleDeletePhoto = (indexToDelete: number) => {
    // 미리보기 URL 메모리 해제 (메모리 누수 방지)
    URL.revokeObjectURL(photos[indexToDelete].image);
    setPhotos((prev) => prev.filter((_, index) => index !== indexToDelete));
    setCurrentIndex((prev) =>
      prev === 0 ? 0 : indexToDelete <= prev ? prev - 1 : prev,
    );
  };

  return {
    photos,
    currentIndex,
    currentPhoto: photos[currentIndex],
    setCurrentIndex,
    handleImageUpload,
    handleKeywordChange,
    handleDeletePhoto,
    canProceed: photos.length > 0 && photos.every((p) => p.processed && (p.keywords?.trim() ?? "") !== ""),
  };
}
