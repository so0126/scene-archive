import os
import tempfile
import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient


os.environ.setdefault("BOOKPRINT_API_KEY", "test-key")
os.environ.setdefault(
    "SCENE_ARCHIVE_DB_PATH",
    os.path.join(tempfile.gettempdir(), "scene_archive_test.db"),
)

import main
import database


class OrderFlowTests(unittest.TestCase):
    def setUp(self):
        fd, self.db_path = tempfile.mkstemp(suffix=".db")
        os.close(fd)
        database.DB_PATH = self.db_path
        database.init_orders_table()
        database.setup_demo_data()
        self.client = TestClient(main.app)

    def tearDown(self):
        self.client.close()
        if os.path.exists(self.db_path):
            os.remove(self.db_path)

    def test_full_order_flow_from_book_init_to_lookup(self):
        with patch.object(main.client.books, "create") as mock_book_create, \
            patch.object(main.client.covers, "create") as mock_cover_create, \
            patch.object(main.client.contents, "insert") as mock_contents_insert, \
            patch.object(main.client.books, "finalize") as mock_book_finalize, \
            patch.object(main.client.orders, "create") as mock_order_create:

            mock_book_create.return_value = {"data": {"bookUid": "bk_test_001"}}
            mock_book_finalize.return_value = {"status": "success"}
            mock_order_create.return_value = {"data": {"orderUid": "ord_test_001"}}

            init_response = self.client.post("/api/book/init")
            self.assertEqual(init_response.status_code, 200)
            self.assertEqual(init_response.json()["book_uid"], "bk_test_001")

            scenes = [
                {"serverFileName": "file_1.jpg", "keyword": "첫 번째 장면"},
                {"serverFileName": "file_2.jpg", "keyword": "두 번째 장면"},
            ]
            save_response = self.client.post(
                "/api/scene/save-scenes",
                json={"book_uid": "bk_test_001", "scenes": scenes},
            )
            self.assertEqual(save_response.status_code, 200)
            self.assertEqual(save_response.json()["status"], "success")
            mock_cover_create.assert_called_once()
            self.assertEqual(mock_contents_insert.call_count, 24)

            order_payload = {
                "book_uid": "bk_test_001",
                "name": "홍길동",
                "phone": "010-1234-5678",
                "postal_code": "12345",
                "address": "서울특별시 마포구",
                "detail_address": "101호",
                "scenes": [
                    {"id": "p1", "image": "https://example.com/1.jpg", "keywords": "첫 번째 장면"},
                    {"id": "p2", "image": "https://example.com/2.jpg", "keywords": "두 번째 장면"},
                ],
            }
            order_response = self.client.post("/api/order/create", json=order_payload)
            self.assertEqual(order_response.status_code, 200)
            self.assertEqual(order_response.json()["order_uid"], "ord_test_001")
            mock_book_finalize.assert_called_once_with("bk_test_001")
            mock_order_create.assert_called_once()

            fetch_response = self.client.get("/api/order/ord_test_001")
            self.assertEqual(fetch_response.status_code, 200)
            self.assertEqual(fetch_response.json()["order_uid"], "ord_test_001")
            self.assertEqual(fetch_response.json()["recipient_name"], "홍길동")

            lookup_response = self.client.post(
                "/api/order/lookup",
                json={"order_uid": "ord_test_001", "phone": "01012345678"},
            )
            self.assertEqual(lookup_response.status_code, 200)
            self.assertEqual(lookup_response.json()["order_uid"], "ord_test_001")
            self.assertEqual(lookup_response.json()["recipient_phone"], "010-1234-5678")


if __name__ == "__main__":
    unittest.main()
