import unittest
import os
from dotenv import load_dotenv
from extraction import (
    get_data_folders,
    set_path,
    get_gamma_options,
    get_solution_name,
    extract_text,
    get_alternate_solutions,
    get_gamma_data,
)
from expected_results import (
    expected_folders,
    expected_options,
    expected_solution_filename,
    expected_extracted_data,
    expected_alt_folders,
    expected_data,
)


class TestExtraction(unittest.TestCase):
    def test_get_data_folders(self):
        self.assertEqual(get_data_folders(), expected_folders)

    def test_get_gamma_options(self):
        load_dotenv()
        path = os.path.join(os.getenv("MALTA_DATA_FOLDER"), str(os.getenv("TEST_DATA")))
        self.assertEqual(get_gamma_options(path), expected_options)

    def test_set_path(self):
        gamma = 200
        expected_path = f"gammas/{gamma}/"
        self.assertEqual(set_path(gamma), expected_path)

    def test_get_solution_name(self):
        folder = str(os.getenv("TEST_DATA"))
        self.assertEqual(get_solution_name(folder, "_model_fit.pdf"), expected_solution_filename)

    def test_extract(self):
        load_dotenv()
        path = "gammas/100/"
        folder = str(os.getenv("TEST_DATA"))

        self.assertEqual(
            extract_text(path, 0, folder), expected_extracted_data
        )

    def test_get_alternate_solutions(self):
        load_dotenv()
        gamma = 100
        folder = str(os.getenv("TEST_DATA"))
        self.assertTrue(type(get_alternate_solutions(gamma, folder) == list))
        self.assertEqual(get_alternate_solutions(gamma, folder), expected_alt_folders)

    def test_get_gamma_data(self):
        gamma = 100
        folder = str(os.getenv("TEST_DATA"))
        self.assertTrue(
            type(get_gamma_data(gamma, folder) == list)
        )
        self.assertEqual(
            get_gamma_data(gamma, folder), expected_data
        )


if __name__ == "__main__":
    unittest.main()
