import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { CheckCircle2, Package, Home } from "lucide-react";

export function Success() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f1ea]">
      {/* Header */}
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

      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="bg-white rounded-lg p-12 shadow-lg text-center">
          <div className="w-24 h-24 bg-[#8b9a8e] rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>

          <h2 className="text-4xl mb-4 text-[#2c2c2c]">주문이 완료되었습니다!</h2>
          <p className="text-lg text-[#5c5c5c] mb-8">
            프리미엄 포토북 제작이 시작되었습니다.
          </p>

          <div className="bg-[#f9f9f9] rounded-lg p-8 mb-8 text-left">
            <h3 className="text-xl mb-6 text-[#2c2c2c]">주문 정보</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-[#8b9a8e] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-[#5c5c5c] mb-1">주문 번호</p>
                  <p className="text-base text-[#2c2c2c]">
                    SA-{Date.now().toString().slice(-8)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-[#8b9a8e] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-[#5c5c5c] mb-1">상품명</p>
                  <p className="text-base text-[#2c2c2c]">
                    Scene Archive 포토북 (A4 하드커버)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-[#8b9a8e] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-[#5c5c5c] mb-1">예상 배송일</p>
                  <p className="text-base text-[#2c2c2c]">
                    {new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f0f7f4] rounded-lg p-6 mb-8">
            <p className="text-sm text-[#5c5c5c] leading-relaxed">
              고품질 포토북 제작을 위해 최선을 다하고 있습니다.
              <br />
              제작 과정에서 문제가 발생할 경우 등록하신 연락처로 안내
              드리겠습니다.
              <br />
              감사합니다. 💚
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => {
                sessionStorage.clear();
                navigate("/");
              }}
              className="bg-[#8b9a8e] hover:bg-[#6d7d70] text-white px-8 py-6 text-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              홈으로 돌아가기
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl mb-6 text-[#2c2c2c]">제작 과정</h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-3xl mb-3">📸</div>
              <h4 className="text-lg mb-2 text-[#2c2c2c]">1. AI 고품질화</h4>
              <p className="text-sm text-[#5c5c5c]">
                업로드하신 이미지를 300DPI로 업스케일링합니다.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-3xl mb-3">🖨️</div>
              <h4 className="text-lg mb-2 text-[#2c2c2c]">2. 프리미엄 인쇄</h4>
              <p className="text-sm text-[#5c5c5c]">
                최고급 용지와 인쇄 기술로 제작합니다.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <div className="text-3xl mb-3">📦</div>
              <h4 className="text-lg mb-2 text-[#2c2c2c]">3. 안전 배송</h4>
              <p className="text-sm text-[#5c5c5c]">
                포장 후 안전하게 배송해드립니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
