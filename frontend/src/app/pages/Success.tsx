// [React] Success.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { SectionCard } from "../components/common/SectionCard";
import { Button } from "../components/ui/button";
import { CheckCircle2, ChevronRight, BookOpen } from "lucide-react";

export function Success() {
  const navigate = useNavigate();
  const [orderedPhotos, setOrderedPhotos] = useState<any[]>([]);

  useEffect(() => {
  const loadContent = async () => {
    const localData = sessionStorage.getItem("orderedPhotos");
    if (localData) {
      setOrderedPhotos(JSON.parse(localData));
    } else {
      // 💡 데이터가 없으면 백엔드에서 SQLite에 저장된 더미 데이터를 가져옴!
      try {
        const response = await fetch("http://localhost:8000/api/scene/demo");
        const demoData = await response.json();
        setOrderedPhotos(demoData);
      } catch (err) {
        console.error("데모 데이터를 불러오지 못했습니다.");
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

        {/* 🎞️ 장면집 미리보기 섹션 */}
        <SectionCard className="p-8 mb-12 text-left bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6 text-[#8b9a8e]">
            <BookOpen className="w-5 h-5" />
            <h3 className="text-xl font-medium">My Archive Preview</h3>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {orderedPhotos.map((photo, index) => (
              <div key={photo.id || index} className="min-w-[280px] group">
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3 shadow-md">
                  <img 
                    src={photo.image} 
                    alt="Scene" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <p className="text-xs text-[#8b9a8e] mb-1">PAGE {index + 1}</p>
                <p className="text-sm text-[#2c2c2c] line-clamp-2 italic">"{photo.keywords}"</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate("/")} className="bg-[#8b9a8e] hover:bg-[#6d7d70] px-10">
            홈으로 돌아가기
          </Button>
          <Button variant="outline" className="border-[#8b9a8e] text-[#8b9a8e]" onClick={() => window.print()}>
            주문 내역 인쇄하기
          </Button>
        </div>
      </div>
    </div>
  );
}