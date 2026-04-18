import { useState } from "react";
import { useNavigate } from "react-router";
import { StepHeader } from "../components/common/StepHeader";
import { SectionCard } from "../components/common/SectionCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Package } from "lucide-react";
import { apiFetch } from "../lib/api";
import { useBookStore } from "../store/useBookStore";
import type { PhotoData } from "../types/photo";

export function Order() {
  const navigate = useNavigate();
  const { bookUid } = useBookStore();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    postalCode: "",
    address: "",
    detailAddress: "",
  });
  const [pageCount] = useState(() => {
    const photosData = sessionStorage.getItem("photos");
    if (photosData) {
      const photos = JSON.parse(photosData);
      return photos.length;
    }
    return 1; // 데이터가 없을 때 기본값
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 필수 입력값 검증
    if (!formData.name || !formData.phone || !formData.postalCode || !formData.address) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    if (!bookUid) {
      alert("책 정보가 없습니다. 홈에서 다시 시작해주세요.");
      return;
    }

    const photos: PhotoData[] = JSON.parse(sessionStorage.getItem("photos") || "[]");

    try {
      // 2. 백엔드 API 호출
      const response = await apiFetch("/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book_uid: bookUid,            // 👈 백엔드 OrderRequest 규격에 맞춤
          name: formData.name,
          phone: formData.phone,
          postal_code: formData.postalCode,
          address: formData.address,
          detail_address: formData.detailAddress,
          scenes: photos.map((photo) => ({
            id: photo.id,
            image: photo.image,
            keywords: photo.keywords,
          })),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ 주문 성공! 주문번호:", result.order_uid);
        
        // 3. 성공 시 데이터 저장 및 페이지 이동
        sessionStorage.setItem("orderData", JSON.stringify(formData));
        sessionStorage.setItem("orderUid", result.order_uid);
        navigate(`/success?orderUid=${encodeURIComponent(result.order_uid)}`);
      } else {
        const errorData = await response.json();
        // ❌ 에러 발생 시 (예: 최소 페이지 미달 등)
        alert(`주문 실패: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("통신 에러:", error);
      alert("서버와 통신 중 문제가 발생했습니다.");
    }
  };

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

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12">
           <h2 className="text-4xl mb-4 text-[#2c2c2c]">주문 및 배송 정보</h2>
          <div className="mb-8 rounded-2xl border border-[#d8dfd8] bg-white px-5 py-4">
            <p className="text-sm text-[#5c5c5c] leading-6">
              입력하신 배송 정보로 포토북 주문이 진행됩니다. 주문 전 우편번호와
              주소를 한 번 더 확인해주세요.
            </p>
          </div>
        <StepHeader currentStep={3} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <SectionCard className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="pb-2 border-b border-[#ece9e2]">
                  <h3 className="text-lg font-semibold text-[#2c2c2c]">
                    수령인 정보
                  </h3>
                  <p className="text-sm text-[#777] mt-1">
                    주문자와 연락 가능한 정보를 입력해주세요.
                  </p>
                </div>
                {/* Name */}
                <div>
                  <Label
                    htmlFor="name"
                    className="text-base mb-2 block text-[#2c2c2c]"
                  >
                    수령인 이름 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="홍길동"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-base p-6 bg-white border-[#8b9a8e]"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-base mb-2 block text-[#2c2c2c]"
                  >
                    연락처 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="010-1234-5678"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="text-base p-6 bg-white border-[#8b9a8e]"
                    required
                  />
                </div>

                {/* Postal Code */}
                <div className="pt-2 pb-2 border-b border-[#ece9e2]">
                  <h3 className="text-lg font-semibold text-[#2c2c2c]">
                    배송지 정보
                  </h3>
                  <p className="text-sm text-[#777] mt-1">
                    포토북을 받으실 주소를 입력해주세요.
                  </p>
                </div>
                <div>
                  <Label
                    htmlFor="postalCode"
                    className="text-base mb-2 block text-[#2c2c2c]"
                  >
                    우편번호 <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="postalCode"
                      type="text"
                      placeholder="12345"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="text-base p-6 bg-white border-[#8b9a8e] rounded-xl"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="px-6 rounded-xl border-[#8b9a8e] text-[#8b9a8e] hover:bg-[#8b9a8e] hover:text-white whitespace-nowrap"
                    >
                      우편번호 찾기
                    </Button>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <Label
                    htmlFor="address"
                    className="text-base mb-2 block text-[#2c2c2c]"
                  >
                    주소 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="서울특별시 강남구 테헤란로 123"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="text-base p-6 bg-white border-[#8b9a8e]"
                    required
                  />
                </div>

                {/* Detail Address */}
                <div>
                  <Label
                    htmlFor="detailAddress"
                    className="text-base mb-2 block text-[#2c2c2c]"
                  >
                    상세 주소
                  </Label>
                  <Input
                    id="detailAddress"
                    type="text"
                    placeholder="101동 1001호"
                    value={formData.detailAddress}
                    onChange={handleInputChange}
                    className="text-base p-6 bg-white border-[#8b9a8e]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#8b9a8e] hover:bg-[#6d7d70] text-white py-6 text-lg mt-8"
                >
                  포토북 주문하기
                </Button>
              </form>
            </SectionCard>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <SectionCard className="p-6 sticky top-8">
              <h3 className="text-xl mb-6 text-[#2c2c2c]">주문 요약</h3>
              <p className="text-sm text-[#777] mb-5">
                지금까지 만든 페이지와 제작 사양을 확인하세요.
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-[#f9f9f9] rounded-xl">
                  <Package className="w-8 h-8 text-[#8b9a8e]" />
                  <div>
                    <p className="text-sm text-[#2c2c2c]">
                      Scene Archive 포토북
                    </p>
                    <p className="text-xs text-[#5c5c5c]">
                      A4 하드커버 · 총 {pageCount}페이지
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#e5e5e5] pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#5c5c5c]">상품 가격</span>
                  <span className="text-[#2c2c2c]">45,000원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5c5c5c]">배송비</span>
                  <span className="text-[#2c2c2c]">무료</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#e5e5e5]">
                  <span className="text-lg text-[#2c2c2c]">총 결제 금액</span>
                  <span className="text-2xl text-[#8b9a8e]">45,000원</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#f0f7f4] rounded-xl">
                <p className="text-xs text-[#5c5c5c] leading-relaxed">
                  • 제작 기간: 영업일 기준 5-7일
                  <br />
                  • 배송 기간: 2-3일
                  <br />• 총 소요 기간: 약 7-10일
                </p>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
