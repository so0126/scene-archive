from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Body, Form, File, UploadFile, HTTPException
from typing import List, Optional, Annotated
from pydantic import BaseModel
from dotenv import load_dotenv
from bookprintapi.exceptions import ApiError
import os
import uuid

load_dotenv()

from bookprintapi import Client
app = FastAPI()

origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # 리액트 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Client()
from database import get_order, init_orders_table, save_order


class SceneItem(BaseModel):
    serverFileName: str
    keyword: str


class OrderSceneItem(BaseModel):
    id: str
    image: str
    keywords: str


class OrderRequest(BaseModel):
    book_uid: str
    name: str
    phone: str
    postal_code: str
    address: str
    detail_address: Optional[str] = ""
    scenes: List[OrderSceneItem] = []


class FinalizeAllRequest(BaseModel):
    book_uid: str
    scenes: List[SceneItem]


class OrderLookupRequest(BaseModel):
    order_uid: str
    phone: str


init_orders_table()


def is_duplicate_cover_error(error: ApiError) -> bool:
    error_text = " ".join(
        [
            error.message or "",
            error.error_code or "",
            " ".join(str(detail) for detail in error.details),
        ]
    ).lower()
    duplicate_tokens = ["already", "exists", "duplicate", "cover"]
    return all(token in error_text for token in ["cover"]) and any(
        token in error_text for token in duplicate_tokens[:-1]
    )


def normalize_phone(value: str) -> str:
    return "".join(char for char in value if char.isdigit())


def is_demo_book_uid(book_uid: str) -> bool:
    return book_uid.startswith("demo_local_")


def unwrap_api_data(payload: dict) -> dict:
    data = payload.get("data")
    return data if isinstance(data, dict) else payload


def extract_order_phone(order_payload: dict) -> str:
    order = unwrap_api_data(order_payload)
    shipping = order.get("shipping") or {}
    candidates = [
        order.get("recipientPhone"),
        order.get("recipient_phone"),
        shipping.get("recipientPhone"),
        shipping.get("recipient_phone"),
    ]
    return next((value for value in candidates if isinstance(value, str) and value.strip()), "")


def normalize_order_response(order_payload: dict) -> dict:
    order = unwrap_api_data(order_payload)
    shipping = order.get("shipping") or {}
    items = order.get("items") or []
    return {
        "order_uid": order.get("orderUid") or order.get("order_uid"),
        "book_uid": order.get("bookUid") or order.get("book_uid"),
        "recipient_name": order.get("recipientName")
        or order.get("recipient_name")
        or shipping.get("recipientName")
        or shipping.get("recipient_name")
        or "",
        "recipient_phone": extract_order_phone(order_payload),
        "postal_code": order.get("postalCode")
        or order.get("postal_code")
        or shipping.get("postalCode")
        or shipping.get("postal_code")
        or "",
        "address1": order.get("address1") or shipping.get("address1") or "",
        "address2": order.get("address2") or shipping.get("address2") or "",
        "status": order.get("status") or order.get("orderStatus") or "created",
        "photo_count": len(items),
        "scenes": [],
        "created_at": order.get("createdAt") or order.get("created_at") or "",
    }


def create_book(title: str):
    return client.books.create(
        book_spec_uid="SQUAREBOOK_HC",
        title=title,
        creation_type="TEST",
        external_ref="PIPELINE-001",
    )


@app.get("/")
def root():
    return {"message": "API Key 로드 성공!"}

@app.get("/api/scene/demo")
def fetch_demo_scenes():
    from database import setup_demo_data, get_demo_scenes

    setup_demo_data()
    raw_data = get_demo_scenes()
    book_uid = f"demo_local_{uuid.uuid4().hex[:12]}"

    return {
        "book_uid": book_uid,
        "scenes": [
            {
                "id": item["id"],
                "image": item["image"],
                "keywords": item["keywords"],
                "serverFileName": f"demo_file_{index + 1}",
                "processed": True
            } for index, item in enumerate(raw_data)
        ]
    }

# 1. 책 프로젝트 생성 API
@app.post("/api/book/init")
def init_book():
    from database import clear_dummy_scenes
    clear_dummy_scenes()
    try:
        res = create_book("Scene Archive")
        return {"book_uid": res["data"]["bookUid"]}
    except ApiError as e:
        print("❌ 책 초기화 실패")
        print(f"상태코드: {e.status_code}")
        print(f"에러메시지: {e.message}")
        if e.details:
            print(f"상세내용: {e.details}")
        raise HTTPException(
            status_code=400,
            detail={
                "message": e.message or "책 생성에 실패했습니다.",
                "error_code": e.error_code or "BOOKPRINT_API_ERROR",
                "details": e.details,
            },
        )


@app.post("/api/photo/upload")
async def upload_photo(book_uid: str = Form(...),
    images: List[UploadFile] = File(...)
):
    print(f"--- 업로드 시작: {len(images)}장의 사진 ---")
    server_files = []

    for image in images:
        temp_path = f"temp_{image.filename}"
        try:
            content = await image.read()
            with open(temp_path, "wb") as f:
                f.write(content)

            # SDK 호출
            res = client.photos.upload(book_uid, temp_path)
            server_files.append({
                "originalName": image.filename,
                "serverFileName": res["data"]["fileName"]
            })
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

    return {"status": "success", "files": server_files}

@app.post("/api/scene/save-scenes")
def save_scenes(data: FinalizeAllRequest):
    print(f"--- 조립 시작: 책UID({data.book_uid}), 장면수({len(data.scenes)}) ---")

    try:
        if not data.scenes:
            raise Exception("사진 데이터(scenes)가 비어있습니다!")

        if is_demo_book_uid(data.book_uid):
            print("✅ 로컬 데모 모드: 외부 API 호출 없이 조립 완료 처리")
            return {"status": "success", "mode": "demo"}

        # 표지 생성
        print("표지 생성 시도 중...")
        client.covers.create(
            data.book_uid,
            template_uid="79yjMH3qRPly",
            parameters={
                "title": "Scene Archive",
                "coverPhoto": data.scenes[0].serverFileName,
                "dateRange": "26.01 - 27.03"
            }
        )
        print("✅ 표지 생성 성공")

        # 내지 삽입
        for i, scene in enumerate(data.scenes):
            print(f"{i + 1}번째 페이지 삽입 중: {scene.serverFileName}")
            client.contents.insert(
                data.book_uid,
                template_uid="46VqZhVNOfAp",
                parameters={
                    "photo": scene.serverFileName,
                    "diaryText": scene.keyword,
                    "monthNum": "04",
                    "dayNum": "25"
                }
            )

        current_count = len(data.scenes)
        if current_count < 24:
            last_scene = data.scenes[-1]
            for _ in range(24 - current_count):
                client.contents.insert(
                    data.book_uid,
                    template_uid="46VqZhVNOfAp",
                    parameters={"photo": last_scene.serverFileName, "diaryText": "...", "monthNum": "04",
                    "dayNum": "25"})
        print(f"✅ 내지 {len(data.scenes)}장 삽입 성공")

        return {"status": "success"}


    except ApiError as e:


        print("❌ 스위트북 API 에러 발생!")

        print(f"상태코드: {e.status_code}")

        print(f"에러메시지: {e.message}")

        if hasattr(e, 'details') and e.details:
            print(f"상세내용: {e.details}")

        if is_duplicate_cover_error(e):
            raise HTTPException(
                status_code=409,
                detail={
                    "message": "이미 표지가 생성된 포토북입니다. 같은 책으로 다시 표지를 만들 수 없어요.",
                    "error_code": "COVER_ALREADY_EXISTS",
                },
            )

        raise HTTPException(
            status_code=400,
            detail={
                "message": str(e),
                "error_code": e.error_code or "BOOKPRINT_API_ERROR",
            },
        )


    except HTTPException:
        raise


    except Exception as e:

        print(f"❌ 일반 에러: {str(e)}")

        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/order/create")
def create_order(req: OrderRequest):
    try:
        if is_demo_book_uid(req.book_uid):
            order_uid = f"demo_ord_{uuid.uuid4().hex[:10]}"
            save_order(
                order_uid=order_uid,
                book_uid=req.book_uid,
                recipient_name=req.name,
                recipient_phone=req.phone,
                postal_code=req.postal_code,
                address1=req.address,
                address2=req.detail_address or "",
                scenes=[scene.model_dump() for scene in req.scenes],
                status="demo_created",
            )
            return {"order_uid": order_uid}

        # ⭐ 드디어 여기서 '확정'! 주문 전 마지막 관문입니다.
        # 페이지 수가 부족하면 여기서 400 에러가 터지며 주문이 중단됩니다.
        client.books.finalize(req.book_uid)
        print(f"✅ 책 확정 성공: {req.book_uid}")

        shipping_info = {
            "recipientName": req.name,
            "recipientPhone": req.phone,
            "postalCode": req.postal_code,
            "address1": req.address,
            "address2": req.detail_address,
        }

        # 주문 생성
        res = client.orders.create(
            items=[{"bookUid": req.book_uid, "quantity": 1}],
            shipping=shipping_info
        )

        data = res.get("data", res)
        order_uid = data.get("orderUid")

        save_order(
            order_uid=order_uid,
            book_uid=req.book_uid,
            recipient_name=req.name,
            recipient_phone=req.phone,
            postal_code=req.postal_code,
            address1=req.address,
            address2=req.detail_address or "",
            scenes=[scene.model_dump() for scene in req.scenes],
        )

        return {"order_uid": order_uid}
    except Exception as e:
        print(f"❌ 주문/확정 실패: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/order/{order_uid}")
def fetch_order(order_uid: str):
    order = get_order(order_uid)
    if not order:
        raise HTTPException(status_code=404, detail="주문 정보를 찾을 수 없습니다.")
    return order


@app.post("/api/order/lookup")
def lookup_order(req: OrderLookupRequest):
    order = get_order(req.order_uid)
    if order:
        if normalize_phone(order["recipient_phone"]) != normalize_phone(req.phone):
            raise HTTPException(status_code=403, detail="주문번호 또는 연락처가 올바르지 않습니다.")
        return order

    try:
        remote_order = client.orders.get(req.order_uid)
    except ApiError as e:
        if e.status_code == 404:
            raise HTTPException(status_code=404, detail="주문 정보를 찾을 수 없습니다.")
        raise HTTPException(
            status_code=400,
            detail={
                "message": e.message or "주문 조회에 실패했습니다.",
                "error_code": e.error_code or "BOOKPRINT_API_ERROR",
                "details": e.details,
            },
        )

    remote_phone = extract_order_phone(remote_order)
    if normalize_phone(remote_phone) != normalize_phone(req.phone):
        raise HTTPException(status_code=403, detail="주문번호 또는 연락처가 올바르지 않습니다.")

    return normalize_order_response(remote_order)
