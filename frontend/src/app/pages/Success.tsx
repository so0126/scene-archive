import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { SectionCard } from "../components/common/SectionCard";
import { Button } from "../components/ui/button";
import { CheckCircle2, BookOpen } from "lucide-react";

// 인터페이스 정의 (타입 안전성)
interface OrderedPhoto {
  id: string;
  image: string;
  keywords: string;
}

export function Success() {
  const navigate = useNavigate();
  const [orderedPhotos, setOrderedPhotos] = useState<OrderedPhoto[]>([]);

  useEffect(() => {
    const loadContent = async () => {
      // 1. 💡 실제 업로드 시 저장되는 'photos' 키를 먼저 확인합니다.
      const localData = sessionStorage.getItem("photos");
      
      if (localData) {
        const parsed = JSON.parse(localData);
        // 데이터가 배열인지 확인 후 설정
        setOrderedPhotos(Array.isArray(parsed) ? parsed : []);
      } else {
        // 2. 💡 데이터가 없으면 백엔드 데모 데이터를 가져옴
        try {
          const response = await fetch("http://localhost:8000/api/scene/demo");
          const demoData = await response.json();
          
          // 💡 핵심: demoData 자체가 아니라 demoData.scenes 배열을 넣어야 합니다!
          if (demoData && demoData.scenes) {
            setOrderedPhotos(demoData.scenes);
          }
        } catch (err) {
          console.error("데이터를 불러오지 못했습니다.", err);
        }
      }
    };
    loadContent();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f1ea] py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <CheckCircle2 className="w-20 h-20 text-[#8b9a8e] mx-auto mb-6" />
        <h2 className="text-4xl font-serif text-[#2c2c2c] mb-4">주문이 완료되었습니다!</h2>
        <p className="text-[#5c5c5c] mb-12">소영님의 소중한 장면들이 곧 책으로 엮여 배달됩니다.</p>

        <SectionCard className="p-8 mb-12 text-left bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6 text-[#8b9a8e]">
            <BookOpen className="w-5 h-5" />
            <h3 className="text-xl font-medium">My Archive Preview</h3>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {/* 💡 배열인지 한 번 더 확인하여 에러 방지 */}
            {Array.isArray(orderedPhotos) && orderedPhotos.length > 0 ? (
              orderedPhotos.map((photo, index) => (
                <div key={photo.id || index} className="min-w-[280px] group">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3 shadow-md bg-gray-100">
                    <img 
                      src={photo.image} 
                      alt="Scene" 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      // 이미지 로드 실패 시 대체 이미지 처리
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                  </div>
                  <p className="text-xs text-[#8b9a8e] mb-1">PAGE {index + 1}</p>
                  <p className="text-sm text-[#2c2c2c] line-clamp-2 italic">
                    "{photo.keywords || "기록된 문장이 없습니다."}"
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[#999] py-10">불러올 수 있는 장면이 없습니다.</p>
            )}
          </div>
        </SectionCard>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate("/")} className="bg-[#8b9a8e] hover:bg-[#6d7d70] px-10">
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}