import { apiFetch } from "./api";

export interface OrderEstimate {
  book_uid: string;
  scene_count: number;
  production_page_count: number;
  quantity: number;
  product_price: number;
  shipping_price: number;
  total_price: number;
  source: string;
}

const ORDER_ESTIMATE_KEY = "orderEstimate";

export function loadOrderEstimate(): OrderEstimate | null {
  const raw = sessionStorage.getItem(ORDER_ESTIMATE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as OrderEstimate;
  } catch {
    return null;
  }
}

export function saveOrderEstimate(estimate: OrderEstimate) {
  sessionStorage.setItem(ORDER_ESTIMATE_KEY, JSON.stringify(estimate));
}

export function clearOrderEstimate() {
  sessionStorage.removeItem(ORDER_ESTIMATE_KEY);
}

export async function requestOrderEstimate(
  bookUid: string,
  sceneCount: number,
  quantity = 1,
) {
  const response = await apiFetch("/api/order/estimate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      book_uid: bookUid,
      scene_count: sceneCount,
      quantity,
    }),
  });

  if (!response.ok) {
    throw new Error("견적 계산에 실패했습니다.");
  }

  const data = (await response.json()) as OrderEstimate;
  saveOrderEstimate(data);
  return data;
}

export function formatPrice(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}
