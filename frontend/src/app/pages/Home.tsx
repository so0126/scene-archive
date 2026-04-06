import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Sparkles, Upload, Wand2, Package, Loader2 , PlayCircle} from "lucide-react";
import { useBookStore } from "../store/useBookStore";
import { useState } from "react";
import type { PhotoData } from "../types/photo"
interface DemoScene {
  id: string;
  image: string;
  keywords: string; 
  serverFileName: string;
  processed: boolean;
}

export function Home() {
  const { initBook, setBookUid, isCreating } = useBookStore();
  const navigate = useNavigate();
  const [isDemoLoading, setIsDemoLoading] = useState(false);
    // 버튼 클릭 시 실행될 로직
    const handleStart = async () => {
      await initBook(); // API 호출 및 UID 저장 대기
      navigate('/upload'); // 완료 후 이동
    };

  const handleDemoStart = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/scene/demo");
    const data = await response.json(); // { book_uid, scenes }

    // 💡 백엔드에서 준 데이터를 그대로 PhotoData 형식으로 매핑
    const preparedPhotos: PhotoData[] = data.scenes.map((s: DemoScene) => ({
      id: s.id,
      image: s.image,
      keywords: s.keywords || "",
      serverFileName: s.serverFileName, // 👈 여기서 "image_b681e7.png" 같은 가짜 말고 진짜를 넣음
      processed: true,
      processing: false,
    }));

    setBookUid(data.book_uid);
    sessionStorage.setItem("photos", JSON.stringify(preparedPhotos));
    
    // 주문 데이터도 미리 세팅
    sessionStorage.setItem("orderData", JSON.stringify({
      name: "박소영", phone: "010-1234-5678", 
      postalCode: "04010", address: "서울특별시 마포구 연남동", detailAddress: "연남서가 2층"
    }));
    navigate("/upload"); 
  } catch (err) {
    alert("데모 로드 실패!");
  }
};
    
  return (
    <div className="min-h-screen bg-[#f5f1ea]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1762274830531-094bfc02b6cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBkcmFtYSUyMHNjZW5lJTIwZW1vdGlvbmFsfGVufDF8fHx8MTc3NTAzMjQyM3ww&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl mb-6 tracking-tight">
            Scene Archive
          </h1>
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-2xl mx-auto">
            AI로 되살리는 인생 명장면 포토에세이
          </p>
          <p className="text-base md:text-lg mb-12 opacity-80 max-w-xl mx-auto">
            저화질 캡처 사진을 고화질로 복원하고, 감성적인 에세이와 함께
            프리미엄 포토북으로 제작해드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

          <Button
                      size="lg"
                      onClick={handleStart} // 수정됨
                      disabled={isCreating} // 로딩 중 클릭 방지
                      className="bg-[#8b9a8e] hover:bg-[#6d7d70] text-white px-12 py-6 text-lg min-w-[240px]"
                      >
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          프로젝트 생성 중...
                        </>
                      ) : (
                        "나만의 에세이북 만들기"
                      )}
                    </Button>
                    <Button
              size="lg"
              variant="outline"
              onClick={handleDemoStart}
              disabled={isCreating || isDemoLoading}
              className="bg-white/10 hover:bg-white/20 text-white border-white/40 px-8 py-6 text-lg min-w-[240px] backdrop-blur-sm"
              >
              {isDemoLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <PlayCircle className="mr-2 h-5 w-5" />
              )}
              데모 데이터로 시작
            </Button>
              </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl text-center mb-16 text-[#2c2c2c]">
            간단한 3단계로 완성
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-[#8b9a8e] rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl mb-4 text-[#2c2c2c]">1. 사진 업로드</h3>
              <p className="text-[#5c5c5c] leading-relaxed">
                좋아하는 드라마나 아이돌의 순간을 캡처한 사진을 업로드하세요.
                저화질 이미지도 괜찮습니다.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-[#8b9a8e] rounded-full flex items-center justify-center mx-auto mb-6">
                <Wand2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl mb-4 text-[#2c2c2c]">2. AI 고품질화</h3>
              <p className="text-[#5c5c5c] leading-relaxed">
                AI가 자동으로 사진을 300DPI 고화질로 업스케일링하고, 키워드를
                바탕으로 감성적인 에세이를 작성합니다.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-[#8b9a8e] rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl mb-4 text-[#2c2c2c]">3. 프리미엄 제작</h3>
              <p className="text-[#5c5c5c] leading-relaxed">
                미리보기로 최종 확인 후 주문하면, 고급 종이책으로 제작하여
                배송해드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1591925323311-cd864ae1740b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXN0aGV0aWMlMjBib29rJTIwcGFnZXMlMjBtaW5pbWFsfGVufDF8fHx8MTc3NTAzMjQyNHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Premium photobook"
                className="rounded-lg shadow-2xl"
              />
            </div>

            <div>
              <h2 className="text-4xl mb-8 text-[#2c2c2c]">
                당신의 소중한 순간을 <br />
                영원히 간직하세요
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <Sparkles className="w-6 h-6 text-[#8b9a8e] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl mb-2 text-[#2c2c2c]">
                      AI 이미지 업스케일링
                    </h4>
                    <p className="text-[#5c5c5c]">
                      저해상도 캡처 이미지를 인쇄 가능한 300DPI 고화질로
                      변환합니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Sparkles className="w-6 h-6 text-[#8b9a8e] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl mb-2 text-[#2c2c2c]">
                      AI 감성 에디팅
                    </h4>
                    <p className="text-[#5c5c5c]">
                      키워드만 입력하면 AI가 이미지를 분석하여 감동적인
                      에세이를 자동으로 작성합니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Sparkles className="w-6 h-6 text-[#8b9a8e] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl mb-2 text-[#2c2c2c]">
                      프리미엄 인쇄 품질
                    </h4>
                    <p className="text-[#5c5c5c]">
                      스위트북 API를 통해 최고급 종이와 제본으로 제작된 포토북을
                      받아보실 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-[#2c2c2c] text-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-lg mb-2">Scene Archive</p>
          <p className="text-sm opacity-70">
            AI로 되살리는 인생 명장면 포토에세이
          </p>
        </div>
      </footer>
    </div>
  );
}
