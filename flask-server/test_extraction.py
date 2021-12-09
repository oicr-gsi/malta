#! /usr/bin/env python3
import os
import unittest
from tempfile import TemporaryDirectory
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
from expected_results import ExpectedResults

exp_res = ExpectedResults()


class TestExtraction(unittest.TestCase):
    def test_get_data_folders(self):
        self.assertEqual(get_data_folders(), exp_res.expected_folders)

    def test_get_gamma_options(self):
        load_dotenv()
        path = os.path.join(
            os.getenv("MALTA_DATA_FOLDER"), str(os.getenv("MALTA_TEST_DATA"))
        )
        self.assertEqual(get_gamma_options(path), exp_res.expected_options)

    def test_set_path(self):
        gamma = 200
        expected_path = f"gammas/{gamma}/"
        self.assertEqual(set_path(gamma), expected_path)

    def test_get_solution_name(self):
        folder = str(os.getenv("MALTA_TEST_DATA"))
        self.assertEqual(
            get_solution_name(folder, "_model_fit.pdf"),
            exp_res.expected_solution_filename,
        )

    def test_extract(self):
        load_dotenv()
        path = "gammas/100/"
        folder = os.getenv("MALTA_TEST_DATA")
        with TemporaryDirectory(prefix="malta_temp_output_") as tmpdir:
            # compare dicts without path attribute as tmpdir path is always different,
            # always fails this test if path is also checked
            actual = extract_text(path, 0, folder, tmpdir)
            del actual["path"]
            del exp_res.expected_extracted_text_data["path"]

            self.assertEqual(actual, exp_res.expected_extracted_text_data)

    def test_get_alternate_solutions(self):
        load_dotenv()
        gamma = 100
        folder = str(os.getenv("MALTA_TEST_DATA"))
        self.assertTrue(type(get_alternate_solutions(gamma, folder) == list))
        self.assertEqual(
            get_alternate_solutions(gamma, folder), exp_res.expected_alt_folders
        )

    def test_get_gamma_data(self):
        gamma = 100
        folder = str(os.getenv("MALTA_TEST_DATA"))

        with TemporaryDirectory(prefix="malta_temp_output_") as tmpdir:
            # compare dicts without path attribute as tmpdir path is always different,
            # always fails this test if path is also checked
            actual = get_gamma_data(gamma, folder, tmpdir)
            for d in actual:
                del d["path"]
            for e in exp_res.expected_data:
                del e["path"]
            self.assertTrue(type(get_gamma_data(gamma, folder, tmpdir) == list))
            self.assertEqual(actual, exp_res.expected_data)


if __name__ == "__main__":
    unittest.main()
