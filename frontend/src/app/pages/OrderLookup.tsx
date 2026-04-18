import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { PackageSearch, Search } from "lucide-react";
import { SectionCard } from "../components/common/SectionCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { apiFetch } from "../lib/api";

interface OrderedPhoto {
  id: string;
  image: string;
  keywords: string;
}

interface OrderLookupResult {
  order_uid: string;
  recipient_name: string;
  recipient_phone: string;
  status: string;
  photo_count: number;
  created_at: string;
  address1: string;
  address2: string;
  scenes: OrderedPhoto[];
}

export function OrderLookup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    orderUid: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<OrderLookupResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orderUid || !formData.phone) {
      setErrorMessage("주문번호와 연락처를 모두 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      setResult(null);

      const response = await apiFetch("/api/order/lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_uid: formData.orderUid.trim(),
          phone: formData.phone.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.detail || "주문 정보를 불러오지 못했습니다.");
        return;
      }

      setResult(data);
    } catch (error) {
      console.error("주문 조회 실패:", error);
      setErrorMessage("서버와 통신 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1ea]">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1
            className="text-2xl text-[#2c2c2c] cursor-pointer"
            onClick={() => navigate("/")}
          >
            Scene Archive
          </h1>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-[#8b9a8e] text-[#8b9a8e] hover:bg-[#8b9a8e] hover:text-white"
          >
            홈으로
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#dfe8df]">
            <PackageSearch className="h-8 w-8 text-[#6d7d70]" />
          </div>
          <h2 className="text-4xl text-[#2c2c2c] mb-3">주문 조회</h2>
          <p className="text-[#5c5c5c]">
            주문번호와 주문 시 입력한 연락처로 현재 주문 정보를 확인할 수 있습니다.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <SectionCard className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="orderUid" className="mb-2 block text-base text-[#2c2c2c]">
                  주문번호
                </Label>
                <Input
                  id="orderUid"
                  value={formData.orderUid}
                  onChange={handleInputChange}
                  placeholder="예: ord_xxxxxxxx"
                  className="p-6 text-base border-[#8b9a8e]"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="mb-2 block text-base text-[#2c2c2c]">
                  연락처
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="010-1234-5678"
                  className="p-6 text-base border-[#8b9a8e]"
                />
              </div>

              {errorMessage && (
                <div className="rounded-xl border border-[#e7c7c7] bg-[#fff6f6] px-4 py-3 text-sm text-[#a14b4b]">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#8b9a8e] hover:bg-[#6d7d70] text-white py-6 text-lg"
              >
                <Search className="h-4 w-4" />
                {isLoading ? "조회 중..." : "주문 조회하기"}
              </Button>
            </form>
          </SectionCard>

          <SectionCard className="p-8">
            <h3 className="mb-6 text-xl text-[#2c2c2c]">조회 안내</h3>
            <div className="space-y-4 text-sm leading-6 text-[#5c5c5c]">
              <p>주문번호는 주문 완료 페이지에서 확인할 수 있습니다.</p>
              <p>연락처는 주문 시 입력한 번호와 같아야 조회됩니다.</p>
              <p>포토북 제작 중인 경우에도 현재 저장된 주문 상태와 미리보기를 확인할 수 있습니다.</p>
            </div>
          </SectionCard>
        </div>

        {result && (
          <div className="mt-8 space-y-8">
            <SectionCard className="p-8">
              <div className="grid gap-4 text-sm text-[#5c5c5c] sm:grid-cols-2">
                <p>
                  주문번호: <span className="text-[#2c2c2c]">{result.order_uid}</span>
                </p>
                <p>
                  주문상태: <span className="text-[#2c2c2c]">{result.status}</span>
                </p>
                <p>
                  주문자: <span className="text-[#2c2c2c]">{result.recipient_name}</span>
                </p>
                <p>
                  제작 페이지 수: <span className="text-[#2c2c2c]">{result.photo_count}장</span>
                </p>
                <p>
                  배송지: <span className="text-[#2c2c2c]">{[result.address1, result.address2].filter(Boolean).join(" ")}</span>
                </p>
                <p>
                  주문일시: <span className="text-[#2c2c2c]">{new Date(result.created_at).toLocaleString()}</span>
                </p>
              </div>
            </SectionCard>

            <SectionCard className="p-8">
              <h3 className="mb-6 text-xl text-[#2c2c2c]">포토북 미리보기</h3>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {result.scenes.map((photo, index) => (
                  <div key={photo.id || index} className="min-w-[240px]">
                    <div className="mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-[#f0f0f0]">
                      <img
                        src={photo.image}
                        alt={`Scene ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="mb-1 text-xs text-[#8b9a8e]">PAGE {index + 1}</p>
                    <p className="text-sm text-[#2c2c2c] line-clamp-2">
                      {photo.keywords || "기록된 문장이 없습니다."}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}
