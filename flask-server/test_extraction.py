import unittest
import os
from dotenv import load_dotenv
from extraction import get_data_folders, set_path, get_gamma_options, get_solution_name, extract, get_alternate_solutions, get_gamma_data

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

    def test_extract(self):
        load_dotenv()
        path="gammas/100/"
        folder = "PANX_1280_Lv_M_100-PM-022_LCM2.results.zip"
        solution_filename = "PANX_1280_Lv_M_WG_100-PM-022_LCM2_model_fit.pdf"
        extracted_data = {'id': 0, 'path': '../../../Desktop/Malta_data/gammas/100/PANX_1280_Lv_M_WG_100-PM-022_LCM2_model_fit.pdf', 'cellularity': 0.61, 'ploidy': 2.0, 'sd.BAF': 0.07}
        self.assertEqual(extract(path, 0, folder, solution_filename), extracted_data)

    def test_get_alternate_solutions(self):
        load_dotenv()
        gamma = 100
        folder = "PANX_1280_Lv_M_100-PM-022_LCM2.results.zip"
        alt_folders = ['gammas/100/sol3_0.3/', 'gammas/100/sol2_0.44/']
        self.assertTrue(type(get_alternate_solutions(gamma, folder) == list))
        self.assertEqual(get_alternate_solutions(gamma, folder), alt_folders)


    def test_get_gamma_data(self):
        gamma = 100
        selected_folder = "PANX_1280_Lv_M_100-PM-022_LCM2.results.zip"
        solution_filename = 'PANX_1280_Lv_M_WG_100-PM-022_LCM2_model_fit.pdf'

        extracted_data = [
                            {'id': 0, 'path': '../../../Desktop/Malta_data/gammas/100/PANX_1280_Lv_M_WG_100-PM-022_LCM2_model_fit.pdf', 'cellularity': 0.61, 'ploidy': 2.0, 'sd.BAF': 0.07}, 
                            {'id': 1, 'path': '../../../Desktop/Malta_data/gammas/100/sol3_0.3/PANX_1280_Lv_M_WG_100-PM-022_LCM2_model_fit.pdf', 'cellularity': 0.3, 'ploidy': 2.7, 'sd.BAF': 0.07}, 
                            {'id': 2, 'path': '../../../Desktop/Malta_data/gammas/100/sol2_0.44/PANX_1280_Lv_M_WG_100-PM-022_LCM2_model_fit.pdf', 'cellularity': 0.44, 'ploidy': 3.9, 'sd.BAF': 0.07}
                        ]
        self.assertTrue(type(get_gamma_data(gamma, selected_folder, solution_filename) == list))
        self.assertEqual(get_gamma_data(gamma, selected_folder, solution_filename), extracted_data)

if __name__ == "__main__":
    unittest.main()