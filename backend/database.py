# backend/database.py
import sqlite3
import os

DB_PATH = "scene_archive.db"


def init_db():
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


def get_demo_scenes():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, image_url, keyword FROM dummy_scenes")
    rows = cursor.fetchall()
    conn.close()
    return [{"id": r[0], "image": r[1], "keywords": r[2], "processed": True} for r in rows]