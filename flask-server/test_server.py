from server import app
import unittest


class TestServer(unittest.TestCase):
    # Testing /data_folders route
    def test_get_data_folders(self):
        tester = app.test_client(self)
        response = tester.get("/data_folders")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content_type, "application/json")

    # Testing /pdf route
    def test_send_pdf(self):
        tester = app.test_client(self)
        response = tester.get("/data_folders")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content_type, "application/json")


if __name__ == "__main__":
    unittest.main()
