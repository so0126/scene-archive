# backend/database.py
import json
import os
import sqlite3
from datetime import datetime, timezone

DB_PATH = os.getenv("SCENE_ARCHIVE_DB_PATH", "scene_archive.db")

def clear_dummy_scenes():
    """일반 시작을 위해 더미 데이터를 싹 비우는 함수"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM dummy_scenes")  # 👈 테이블 비우기
    conn.commit()
    conn.close()


def setup_demo_data():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # 테이블 생성 (책 정보 및 장면 정보)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS dummy_scenes (
            id TEXT PRIMARY KEY,
            image_url TEXT,
            keyword TEXT,
            is_demo INTEGER DEFAULT 1
        )
    ''')

    # 데이터가 비어있으면 AI로 생성한 '언내추럴/MIU404' 데이터 삽입
    cursor.execute("SELECT COUNT(*) FROM dummy_scenes")
    if cursor.fetchone()[0] == 0:
        demo_data = [
            ("d1", "https://picsum.photos/id/101/800/600", "언내추럴: 법의학은 미래를 위한 학문이다."),
            ("d2", "https://picsum.photos/id/102/800/600", "미코토: 절망할 시간이 있으면 맛있는 걸 먹고 잘래."),
            ("d3", "https://picsum.photos/id/103/800/600", "MIU404: 0에서 1 사이의 그 순간을 잡는 거야."),
            ("d4", "https://picsum.photos/id/104/800/600", "이부키: 내 큐은(심쿵)은 틀리지 않았어!"),
            # ... (이런 식으로 24개까지 확장 가능)
        ]
        # 24개 채우기 귀찮으시면 아래처럼 반복문으로 더미를 더 만드세요
        for i in range(5, 25):
            demo_data.append((f"d{i}", f"https://picsum.photos/id/{100 + i}/800/600", f"Scene Archive {i}번째 기록"))

        cursor.executemany("INSERT INTO dummy_scenes VALUES (?, ?, ?, 1)", demo_data)
        conn.commit()
    conn.close()


def init_orders_table():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS orders (
            order_uid TEXT PRIMARY KEY,
            book_uid TEXT NOT NULL,
            recipient_name TEXT NOT NULL,
            recipient_phone TEXT NOT NULL,
            postal_code TEXT NOT NULL,
            address1 TEXT NOT NULL,
            address2 TEXT DEFAULT '',
            status TEXT NOT NULL DEFAULT 'created',
            photo_count INTEGER NOT NULL DEFAULT 0,
            scenes_json TEXT NOT NULL DEFAULT '[]',
            created_at TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()


def save_order(
    order_uid: str,
    book_uid: str,
    recipient_name: str,
    recipient_phone: str,
    postal_code: str,
    address1: str,
    address2: str = "",
    scenes: list[dict] | None = None,
    status: str = "created",
):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    scenes = scenes or []
    cursor.execute(
        """
        INSERT OR REPLACE INTO orders (
            order_uid,
            book_uid,
            recipient_name,
            recipient_phone,
            postal_code,
            address1,
            address2,
            status,
            photo_count,
            scenes_json,
            created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            order_uid,
            book_uid,
            recipient_name,
            recipient_phone,
            postal_code,
            address1,
            address2,
            status,
            len(scenes),
            json.dumps(scenes, ensure_ascii=False),
            datetime.now(timezone.utc).isoformat(),
        ),
    )
    conn.commit()
    conn.close()


def get_order(order_uid: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders WHERE order_uid = ?", (order_uid,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    return {
        "order_uid": row["order_uid"],
        "book_uid": row["book_uid"],
        "recipient_name": row["recipient_name"],
        "recipient_phone": row["recipient_phone"],
        "postal_code": row["postal_code"],
        "address1": row["address1"],
        "address2": row["address2"],
        "status": row["status"],
        "photo_count": row["photo_count"],
        "scenes": json.loads(row["scenes_json"]),
        "created_at": row["created_at"],
    }


def get_demo_scenes():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, image_url, keyword FROM dummy_scenes")
    rows = cursor.fetchall()
    conn.close()
    return [{"id": r[0], "image": r[1], "keywords": r[2], "processed": True} for r in rows]
