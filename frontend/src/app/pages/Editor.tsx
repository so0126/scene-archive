import type React from "react";
import type { PhotoData } from "../types/photo";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { StepHeader } from "../components/common/StepHeader";
import { SectionCard } from "../components/common/SectionCard";
import { Loader2, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

export function Editor() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Get data from previous page
    const photosData = sessionStorage.getItem("photos");

    if (!photosData) {
      navigate("/upload");
      return;
    }

    const parsedPhotos: PhotoData[] = JSON.parse(photosData);
    setPhotos(parsedPhotos);

    // Simulate AI text generation for all photos
    setTimeout(() => {
      const photosWithText = parsedPhotos.map((photo) => ({
        ...photo,
        aiText: generateAIEssay(photo.keywords),
      }));
      setPhotos(photosWithText);
      setIsGenerating(false);
    }, 2500);
  }, [navigate]);

  const generateAIEssay = (keywords: string) => {
    // Mock AI-generated essay based on keywords
    return `${keywords}의 순간이 담긴 이 장면은 특별한 의미를 지니고 있습니다.

화면 속에서 펼쳐지는 감정의 흐름은 시간을 초월하여 우리의 마음에 깊은 울림을 남깁니다. 그 순간의 빛, 그림자, 표정 하나하나가 모여 하나의 완벽한 이야기를 만들어냅니다.

이것은 단순한 장면이 아닙니다. 이것은 우리가 느낀 감정의 기록이자, 영원히 간직하고 싶은 순간의 증거입니다.`;
  };

  const handleTextChange = (value: string) => {
    setPhotos((prev) =>
      prev.map((photo, index) =>
        index === currentIndex ? { ...photo, aiText: value } : photo,
      ),
    );
  };

  const handleSaveAndContinue = () => {
    sessionStorage.setItem("photos", JSON.stringify(photos));
    navigate("/order");
  };

  const currentPhoto = photos[currentIndex];

  return (
    <div className="min-h-screen bg-[#f5f1ea]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1
            className="text-2xl text-[#2c2c2c] cursor-pointer"
            onClick={() => navigate("/")}
          >
            Scene Archive
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-4xl mb-4 text-[#2c2c2c]">AI 에디팅</h2>
          <p className="text-lg text-[#5c5c5c]">
            AI가 생성한 에세이를 각 페이지별로 확인하고 수정하세요.
          </p>
        </div>
        <StepHeader currentStep={2} />

        {isGenerating ? (
          <SectionCard className="flex flex-col items-center justify-center h-96">
            <Loader2 className="w-12 h-12 animate-spin text-[#8b9a8e] mb-4" />
            <p className="text-lg text-[#5c5c5c]">
              AI가 {photos.length}개의 페이지에 감성적인 에세이를 작성하고
              있습니다...
            </p>
            <p className="text-sm text-[#5c5c5c] mt-2">잠시만 기다려주세요</p>
          </SectionCard>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Book Preview */}
            <SectionCard className="bg-white rounded-lg p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl text-[#2c2c2c]">
                  페이지 {currentIndex + 1} / {photos.length}
                </h3>
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      setCurrentIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentIndex === 0}
                    size="sm"
                    variant="outline"
                    className="border-[#8b9a8e] text-[#8b9a8e] hover:bg-[#8b9a8e] hover:text-white disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() =>
                      setCurrentIndex((prev) =>
                        Math.min(photos.length - 1, prev + 1),
                      )
                    }
                    disabled={currentIndex === photos.length - 1}
                    size="sm"
                    variant="outline"
                    className="border-[#8b9a8e] text-[#8b9a8e] hover:bg-[#8b9a8e] hover:text-white disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="aspect-[3/4] bg-[#fefefe] rounded-2xl overflow-hidden shadow-xl border border-[#e8e5df]">
                {/* Book page simulation */}
                {currentPhoto && (
                  <div className="h-full flex flex-col p-7">
                    {/* Image section */}
                    <div className="flex-1 mb-4">
                      <img
                        src={currentPhoto.image}
                        alt="Enhanced"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>

                    {/* Text section preview */}
                    <div className="space-y-2 max-h-32 overflow-hidden">
                      <p className="text-xs text-[#5c5c5c] italic">
                        {currentPhoto.keywords}
                      </p>
                      <p className="text-xs text-[#2c2c2c] leading-relaxed font-serif line-clamp-4">
                        {currentPhoto.aiText}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-[#f9f9f9] rounded-xl">
                <p className="text-sm text-[#5c5c5c]">
                  <strong>총 페이지:</strong> {photos.length}페이지
                </p>
                <p className="text-sm text-[#5c5c5c] mt-1">
                  <strong>사이즈:</strong> 210mm × 297mm (A4)
                </p>
                <p className="text-sm text-[#5c5c5c] mt-1">
                  <strong>제본:</strong> 하드커버 양장본
                </p>
              </div>

              {/* Page Thumbnails */}
              <div className="mt-6">
                <h4 className="text-sm text-[#5c5c5c] mb-3">전체 페이지</h4>
                <div className="grid grid-cols-4 gap-3">
                  {photos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className={`aspect-[3/4] rounded-xl cursor-pointer border-2 transition-all ${
                        index === currentIndex
                          ? "border-[#8b9a8e] ring-2 ring-[#8b9a8e]"
                          : "border-[#e5e5e5] hover:border-[#8b9a8e]"
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    >
                      <img
                        src={photo.image}
                        alt={`Page ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>

            {/* Right: AI Text Editor */}
            <SectionCard className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl text-[#2c2c2c]">
                  페이지 {currentIndex + 1} 에세이
                </h3>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-[#8b9a8e] text-[#8b9a8e] hover:bg-[#8b9a8e] hover:text-white"
                >
                  {isEditing ? "수정 완료" : "수정하기"}
                </Button>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl bg-[#f0f7f4] px-4 py-3">
                  <p className="text-sm text-[#5b6b5f]">
                    {isEditing
                      ? "에세이를 직접 수정하고 있어요. 저장 없이도 다음 단계로 함께 반영됩니다."
                      : "AI가 만든 초안을 읽고, 필요하면 수정할 수 있어요."}
                  </p>
                </div>
                <div className="flex items-start gap-2 p-4 bg-[#f0f7f4] rounded-xl">
                  <Sparkles className="w-5 h-5 text-[#8b9a8e] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-[#5c5c5c] mb-1">
                      <strong>키워드:</strong> {currentPhoto?.keywords}
                    </p>
                    <p className="text-xs text-[#5c5c5c]">
                      AI가 이 키워드를 바탕으로 에세이를 작성했습니다.
                    </p>
                  </div>
                </div>

                {isEditing ? (
                  <Textarea
                    value={currentPhoto?.aiText || ""}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleTextChange(e.target.value)
                    }
                    className="min-h-[450px] rounded-xl text-base leading-8 font-serif bg-white border-[#8b9a8e] focus:border-[#6d7d70]"
                  />
                ) : (
                  <div className="min-h-[450px] p-5 bg-[#fefefe] rounded-xl border border-[#e5e5e5] overflow-y-auto">
                    <p className="text-base leading-relaxed whitespace-pre-wrap font-serif text-[#2c2c2c]">
                      {currentPhoto?.aiText}
                    </p>
                  </div>
                )}

                {/* Navigation within editor */}
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      setCurrentIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentIndex === 0}
                    variant="outline"
                    className="flex-1 border-[#8b9a8e] text-[#8b9a8e] hover:bg-[#8b9a8e] hover:text-white disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    이전 페이지
                  </Button>
                  <Button
                    onClick={() =>
                      setCurrentIndex((prev) =>
                        Math.min(photos.length - 1, prev + 1),
                      )
                    }
                    disabled={currentIndex === photos.length - 1}
                    variant="outline"
                    className="flex-1 border-[#8b9a8e] text-[#8b9a8e] hover:bg-[#8b9a8e] hover:text-white disabled:opacity-30"
                  >
                    다음 페이지
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <Button
                  onClick={handleSaveAndContinue}
                  className="w-full bg-[#8b9a8e] hover:bg-[#6d7d70] text-white py-6 text-lg"
                >
                  주문 단계로 →
                </Button>
              </div>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}
