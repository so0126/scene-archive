import os
import tempfile
import unittest
from unittest.mock import MagicMock, patch


os.environ.setdefault("BOOKPRINT_API_KEY", "test-key")
os.environ.setdefault(
    "SCENE_ARCHIVE_DB_PATH",
    os.path.join(tempfile.gettempdir(), "scene_archive_test.db"),
)

from bookprintapi.books import BooksClient
from bookprintapi.client import Client
from bookprintapi.exceptions import ApiError
import main


class DummyResponse:
    def __init__(self, *, ok=True, text="", status_code=200, json_data=None, reason="OK", method="POST", url="https://example.com/Books"):
        self.ok = ok
        self.text = text
        self.status_code = status_code
        self._json_data = json_data if json_data is not None else {}
        self.reason = reason
        self.request = type("Request", (), {"method": method, "url": url})()

    def json(self):
        return self._json_data


class BooksClientTests(unittest.TestCase):
    def test_books_create_includes_expected_payload(self):
        mock_client = MagicMock()
        books = BooksClient(mock_client)

        books.create(
            book_spec_uid="SQUAREBOOK_HC",
            title="Scene Archive",
            creation_type="EBOOK_SYNC",
            external_ref="PIPELINE-001",
        )

        mock_client.post.assert_called_once_with(
            "/Books",
            payload={
                "bookSpecUid": "SQUAREBOOK_HC",
                "creationType": "EBOOK_SYNC",
                "title": "Scene Archive",
                "externalRef": "PIPELINE-001",
            },
        )

    def test_handle_response_raises_on_empty_books_response(self):
        client = Client(api_key="test-key", base_url="https://example.com")
        response = DummyResponse(text="", status_code=200)

        with self.assertRaises(ApiError) as ctx:
            client._handle_response(response)

        self.assertIn("empty response body", str(ctx.exception).lower())


class CreateBookTests(unittest.TestCase):
    @patch.object(main.client.books, "create")
    def test_create_book_uses_expected_arguments(self, mock_create):
        mock_create.return_value = {"data": {"bookUid": "bk_test"}}

        result = main.create_book("Scene Archive")

        self.assertEqual(result, {"data": {"bookUid": "bk_test"}})
        mock_create.assert_called_once_with(
            book_spec_uid="SQUAREBOOK_HC",
            title="Scene Archive",
            creation_type="EBOOK_SYNC",
            external_ref="PIPELINE-001",
        )


if __name__ == "__main__":
    unittest.main()
