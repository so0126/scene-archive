import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Upload as UploadIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { usePhotoFlow } from "../hooks/usePhotoFlow";

export function Upload() {
  const navigate = useNavigate();

  const {
    photos,
    currentIndex,
    currentPhoto,
    setCurrentIndex,
    handleImageUpload,
    handleKeywordChange,
    handleDeletePhoto,
    canProceed,
  } = usePhotoFlow();

  const handleNext = () => {
    const allHaveKeywords = photos.every((p) => p.keywords.trim() !== "");
    if (!allHaveKeywords) {
      alert("모든 사진에 장면 키워드를 입력해주세요.");
      return;
    }

    sessionStorage.setItem("photos", JSON.stringify(photos));
    navigate("/editor");
  };

  return (
    <div className="min-h-screen bg-[#f5f1ea]">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1
            className="text-2xl text-[#2c2c2c] cursor-pointer"
            onClick={() => navigate("/")}
          >
            Scene Archive
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-4xl mb-4 text-[#2c2c2c]">사진 업로드 & AI 처리</h2>
          <p className="text-lg text-[#5c5c5c]">
            소중한 순간을 담은 사진들을 업로드하면 자동으로 고화질 변환이 시작됩니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <Label className="text-lg mb-4 block text-[#2c2c2c]">
                사진 선택 ({photos.length}장)
              </Label>
              <div className="border-2 border-dashed border-[#8b9a8e] rounded-lg p-12 text-center bg-white hover:bg-[#f9f9f9] transition-colors">
                <label className="cursor-pointer block">
                  <UploadIcon className="w-16 h-16 mx-auto mb-4 text-[#8b9a8e]" />
                  <p className="text-lg mb-2 text-[#2c2c2c]">클릭하여 사진 업로드</p>
                  <p className="text-sm text-[#5c5c5c]">여러 장 선택 가능 (JPG, PNG)</p>
                  <p className="text-xs text-[#8b9a8e] mt-2">
                    업로드 즉시 AI 고화질 변환이 시작됩니다
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {photos.length > 0 && currentPhoto && (
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl text-[#2c2c2c]">
                    사진 {currentIndex + 1} / {photos.length}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePhoto(currentIndex)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    삭제
                  </Button>
                </div>

                <div className="mb-4 relative">
                  <img
                    src={currentPhoto.image}
                    alt={`Photo ${currentIndex + 1}`}
                    className="w-full rounded-lg max-h-64 object-cover"
                  />
                  {currentPhoto.processing && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <div className="text-center text-white">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                        <p className="text-sm">AI 고화질 변환 중...</p>
                      </div>
                    </div>
                  )}
                  {currentPhoto.processed && (
                    <div className="absolute top-2 left-2 bg-[#8b9a8e] text-white px-3 py-1 rounded text-sm">
                      ✓ 고화질 변환 완료
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <Label htmlFor="keywords" className="text-base mb-2 block text-[#2c2c2c]">
                    장면 키워드
                  </Label>
                  {currentPhoto.processing ? (
                    <div className="p-4 bg-[#f9f9f9] rounded border border-[#e5e5e5] text-center text-[#5c5c5c]">
                      고화질 변환이 완료되면 키워드를 입력할 수 있습니다
                    </div>
                  ) : (
                    <Input
                      id="keywords"
                      placeholder="예: 언내추럴 1화, 미코토의 결심"
                      value={currentPhoto.keywords}
                      onChange={(e) => handleKeywordChange(e.target.value)}
                      className="text-base p-4 bg-white border-[#8b9a8e]"
                    />
                  )}
                </div>

                {currentPhoto.processed && currentPhoto.keywords && (
                  <div className="p-4 bg-[#f0f7f4] rounded-lg text-center">
                    <p className="text-[#8b9a8e]">✓ 이 사진 준비 완료</p>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    variant="outline"
                    className="flex-1 border-[#8b9a8e] text-[#8b9a8e] hover:bg-[#8b9a8e] hover:text-white disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    이전
                  </Button>
                  <Button
                    onClick={() =>
                      setCurrentIndex((prev) => Math.min(photos.length - 1, prev + 1))
                    }
                    disabled={currentIndex === photos.length - 1}
                    variant="outline"
                    className="flex-1 border-[#8b9a8e] text-[#8b9a8e] hover:bg-[#8b9a8e] hover:text-white disabled:opacity-30"
                  >
                    다음
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl mb-6 text-[#2c2c2c]">처리 현황</h3>

            {photos.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center text-[#5c5c5c]">
                  <p className="text-lg">
                    사진을 업로드하면
                    <br />
                    처리 현황이 여기에 표시됩니다.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {photos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        index === currentIndex
                          ? "border-[#8b9a8e] bg-[#f0f7f4]"
                          : "border-[#e5e5e5] bg-white hover:border-[#8b9a8e]"
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={photo.image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                          {photo.processing && (
                            <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                              <Loader2 className="w-4 h-4 text-white animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-[#2c2c2c] mb-1">사진 {index + 1}</p>
                          {photo.processing ? (
                            <p className="text-xs text-[#8b9a8e]">변환 중...</p>
                          ) : photo.keywords ? (
                            <p className="text-xs text-[#5c5c5c] truncate">{photo.keywords}</p>
                          ) : (
                            <p className="text-xs text-[#999] italic">키워드 미입력</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-[#e5e5e5]">
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#5c5c5c]">진행 상황</span>
                      <span className="text-[#2c2c2c]">
                        {photos.filter((p) => p.processed && p.keywords).length} / {photos.length} 완료
                      </span>
                    </div>
                    <div className="w-full bg-[#e5e5e5] rounded-full h-3">
                      <div
                        className="bg-[#8b9a8e] h-3 rounded-full transition-all"
                        style={{
                          width: `${(photos.filter((p) => p.processed && p.keywords).length / photos.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="w-full bg-[#8b9a8e] hover:bg-[#6d7d70] text-white py-6 text-lg disabled:opacity-50"
                  >
                    다음 단계로 →
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}