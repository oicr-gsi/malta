import unittest
import os
from dotenv import load_dotenv
from extraction import get_data_folders, set_path, get_gamma_options, get_solution_name

class TestExtraction(unittest.TestCase):
    def test_get_data_folders(self):
        folders = ["PANX_1277_Lv_M_100-JHU-003_LCM3.zip", "PANX_1280_Lv_M_100-PM-022_LCM2.results.zip", "PANX_1288_Pm_M_100_JHU_004_LCM3_6.results.zip"]
        self.assertTrue(type(folders) == list)
        self.assertEqual(get_data_folders(), folders)
    
    def test_get_gamma_options(self):
        load_dotenv()
        path = os.path.join(os.getenv("MALTA_DATA_FOLDER"), str(os.getenv("TEST_DATA")))
        options = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1250, 1500, 2000]
        self.assertTrue(type(options) == list)
        self.assertEqual(get_gamma_options(path), options)

    def test_set_path(self):
        gamma = 200
        test_path = f"gammas/{gamma}/"
        self.assertEqual(set_path(gamma),test_path)

    def test_get_solution_name(self):
        folder = "PANX_1280_Lv_M_100-PM-022_LCM2.results.zip"
        solution_filename = "PANX_1280_Lv_M_WG_100-PM-022_LCM2_model_fit.pdf"
        self.assertEqual(get_solution_name(folder), solution_filename)

if __name__ == "__main__":
    unittest.main()