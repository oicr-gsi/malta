import os
from tempfile import TemporaryDirectory
from dotenv import load_dotenv

load_dotenv()


class ExpectedResults:
    def __init__(self):
        self.expected_folders = [
            "PANX_1249_Lv_M_100-PM-013_LCM5.results.zip",
            "PANX_1277_Lv_M_100-JHU-003_LCM3.zip",
            "PANX_1280_Lv_M_100-PM-022_LCM2.results.zip",
            "PANX_1288_Pm_M_100_JHU_004_LCM3_6.results.zip",
            "PANX_1295_Pm_M_WG_100-NH-002_LCM4_results.zip",
            "PANX_1296_Pa_P_WG_100-PM-025_LCM6_results.zip",
        ]

        self.expected_options = [
            50,
            100,
            200,
            300,
            400,
            500,
            600,
            700,
            800,
            900,
            1000,
            1250,
            1500,
            2000,
        ]

        self.expected_solution_filename = (
            "PANX_1280_Lv_M_WG_100-PM-022_LCM2_model_fit.pdf"
        )

        self.expected_extracted_text_data = {
            "id": 0,
            "path": os.path.join(
                os.getenv("MALTA_OUTPUT_FOLDER"),
                "gammas/100/PANX_1280_Lv_M_WG_100-PM-022_LCM2_model_fit.pdf",
            ),
            "cellularity": 0.61,
            "ploidy": 2.0,
            "sd.BAF": 0.07,
        }

        self.expected_alt_folders = ["gammas/100/sol3_0.3/", "gammas/100/sol2_0.44/"]

        self.expected_data = [
            {
                "id": 0,
                "path": os.path.join(
                    os.getenv("MALTA_OUTPUT_FOLDER"),
                    "gammas/100/PANX_1280_Lv_M_WG_100-PM-022_LCM2_model_fit.pdf",
                ),
                "cellularity": 0.61,
                "ploidy": 2.0,
                "sd.BAF": 0.07,
            },
            {
                "id": 1,
                "path": os.path.join(
                    os.getenv("MALTA_OUTPUT_FOLDER"),
                    "gammas/100/sol3_0.3/PANX_1280_Lv_M_WG_100-PM-022_LCM2_model_fit.pdf",
                ),
                "cellularity": 0.3,
                "ploidy": 2.7,
                "sd.BAF": 0.07,
            },
            {
                "id": 2,
                "path": os.path.join(
                    os.getenv("MALTA_OUTPUT_FOLDER"),
                    "gammas/100/sol2_0.44/PANX_1280_Lv_M_WG_100-PM-022_LCM2_model_fit.pdf",
                ),
                "cellularity": 0.44,
                "ploidy": 3.9,
                "sd.BAF": 0.07,
            },
        ]
