import unittest
import os
from dotenv import load_dotenv
from extraction import (
    get_data_folders,
    set_path,
    get_gamma_options,
    get_solution_name,
    extract,
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
        self.assertEqual(get_solution_name(folder), expected_solution_filename)

    def test_extract(self):
        load_dotenv()
        path = "gammas/100/"
        folder = str(os.getenv("TEST_DATA"))
        solution_filename = "PANX_1280_Lv_M_WG_100-PM-022_LCM2_model_fit.pdf"

        self.assertEqual(
            extract(path, 0, folder, solution_filename), expected_extracted_data
        )

    def test_get_alternate_solutions(self):
        load_dotenv()
        gamma = 100
        folder = str(os.getenv("TEST_DATA"))
        self.assertTrue(type(get_alternate_solutions(gamma, folder) == list))
        self.assertEqual(get_alternate_solutions(gamma, folder), expected_alt_folders)

    def test_get_gamma_data(self):
        gamma = 100
        selected_folder = str(os.getenv("TEST_DATA"))
        solution_filename = "PANX_1280_Lv_M_WG_100-PM-022_LCM2_model_fit.pdf"

        self.assertTrue(
            type(get_gamma_data(gamma, selected_folder, solution_filename) == list)
        )
        self.assertEqual(
            get_gamma_data(gamma, selected_folder, solution_filename), expected_data
        )


if __name__ == "__main__":
    unittest.main()
