import os
import tempfile
import unittest
from unittest.mock import patch


os.environ.setdefault("BOOKPRINT_API_KEY", "test-key")
os.environ.setdefault(
    "SCENE_ARCHIVE_DB_PATH",
    os.path.join(tempfile.gettempdir(), "scene_archive_test.db"),
)

from fastapi import HTTPException

import main
from bookprintapi.exceptions import ApiError


class OrderLookupTests(unittest.TestCase):
    def setUp(self):
        self.req = main.OrderLookupRequest(order_uid="ord_test", phone="010-1234-5678")

    @patch("main.get_order")
    def test_lookup_returns_local_order_when_phone_matches(self, mock_get_order):
        mock_get_order.return_value = {
            "order_uid": "ord_test",
            "recipient_phone": "01012345678",
            "recipient_name": "홍길동",
            "status": "created",
            "photo_count": 1,
            "address1": "서울",
            "address2": "",
            "scenes": [],
            "created_at": "2026-01-01T00:00:00+00:00",
        }

        result = main.lookup_order(self.req)

        self.assertEqual(result["order_uid"], "ord_test")

    @patch("main.get_order")
    def test_lookup_raises_403_when_local_phone_mismatches(self, mock_get_order):
        mock_get_order.return_value = {
            "order_uid": "ord_test",
            "recipient_phone": "01099998888",
            "recipient_name": "홍길동",
            "status": "created",
            "photo_count": 1,
            "address1": "서울",
            "address2": "",
            "scenes": [],
            "created_at": "2026-01-01T00:00:00+00:00",
        }

        with self.assertRaises(HTTPException) as ctx:
            main.lookup_order(self.req)

        self.assertEqual(ctx.exception.status_code, 403)

    @patch("main.get_order", return_value=None)
    @patch.object(main.client.orders, "get")
    def test_lookup_returns_remote_order_when_phone_matches(self, mock_orders_get, _mock_get_order):
        mock_orders_get.return_value = {
            "data": {
                "orderUid": "ord_test",
                "recipientName": "홍길동",
                "status": "paid",
                "createdAt": "2026-01-01T00:00:00+00:00",
                "shipping": {
                    "recipientPhone": "01012345678",
                    "postalCode": "12345",
                    "address1": "서울",
                    "address2": "101호",
                },
                "items": [{"bookUid": "bk_123"}],
            }
        }

        result = main.lookup_order(self.req)

        self.assertEqual(result["order_uid"], "ord_test")
        self.assertEqual(result["recipient_phone"], "01012345678")
        self.assertEqual(result["photo_count"], 1)

    @patch("main.get_order", return_value=None)
    @patch.object(main.client.orders, "get")
    def test_lookup_raises_403_when_remote_phone_mismatches(self, mock_orders_get, _mock_get_order):
        mock_orders_get.return_value = {
            "data": {
                "orderUid": "ord_test",
                "shipping": {
                    "recipientPhone": "01000000000",
                },
                "items": [],
            }
        }

        with self.assertRaises(HTTPException) as ctx:
            main.lookup_order(self.req)

        self.assertEqual(ctx.exception.status_code, 403)

    @patch("main.get_order", return_value=None)
    @patch.object(main.client.orders, "get")
    def test_lookup_raises_404_when_order_not_found(self, mock_orders_get, _mock_get_order):
        mock_orders_get.side_effect = ApiError("Not Found", status_code=404)

        with self.assertRaises(HTTPException) as ctx:
            main.lookup_order(self.req)

        self.assertEqual(ctx.exception.status_code, 404)


if __name__ == "__main__":
    unittest.main()
