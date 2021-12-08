# Author: Vivek Alamuri - Bioinformatics Programmer, OICR, Sept. 2021
import os
from zipfile import ZipFile, is_zipfile
from PyPDF2 import PdfFileReader
from dotenv import load_dotenv
import re


def get_data_folders():
    """
    Helper function to get available data folders

    Returns:
        List of Strings, names of zip files available in specified directory
    """
    load_dotenv()
    zips = [
        (f.name) for f in os.scandir(os.getenv("MALTA_DATA_FOLDER")) if is_zipfile(f)
    ]
    return sorted(zips)


def get_gamma_options(path):
    """
    Gets names of gamma folders in a specified directory

    Args:
        path: String, path to zip folder

    Returns:
        List of integers, options for gamma dropdown
    """

    with ZipFile(path, "r") as f:
        folders = [info.filename for info in f.infolist() if info.is_dir()]

    filtered = []
    for folder in folders:
        match = re.findall("\d{2,4}", folder)
        filtered.append(match)

    gamma_options = set()
    for i in range(len(folders)):
        if filtered[i] != []:
            option = int(filtered[i][0])
            # adding all options into a set to save unique gamma values only
            gamma_options.add(option)

    return sorted(gamma_options)


def set_path(gamma):
    """
    Helper function to set the path inside the zip folder

    Args:
        gamma: Integer, gamma value

    Returns: String, path to chosen gamma from inside zip folder
    """
    return f"gammas/{gamma}/"


def get_solution_name(selected_folder, filename):
    """
    Helper function to find full filename of a specified file type, such as model_fit and genome_view.

    Args:
        selected_folder: String, name of selected data folder. Example: PANX_1280_Lv_M_100-PM-022_LCM2.results.zip
        filename: String, unique part of end of filename. Example: "_model_fit.pdf"

    Returns:
        String, filename of specified file type file for that zip folder. Example: PANX_1288_Pm_M_WG_100_JHU_004_LCM3_6_model_fit.pdf

    """

    with ZipFile(
        os.path.join(str(os.getenv("MALTA_DATA_FOLDER")), selected_folder), "r"
    ) as f:
        names = [name for name in f.namelist() if filename in name]

    # accessing filename with [-1] as it is the last element of the split string
    pdf_files = [path.split("/")[-1] for path in names]

    # casting to a set to ensure that there is only one unique model_fit filename
    # casting the set to a list to easily access the desired string
    return list(set(pdf_files))[0]


def jsonify_extracted_text(path, text, data_unique_key):
    """
    Helper function for extract() to format extracted text into JSON format

    Args:
        path: String, file path to PDF

        text: String, text extracted from PDF

        data_unique_key: Integer, a unique id for each solution. 0 indicates ideal solution

    Returns:
        Dictionary with id, file path to PDF, cellularity, ploidy, and sd.BAF values
    """

    split_data = text.split()

    json = {
        "id": data_unique_key,
        "path": path,
        # cellularity: {cellularity_value}; indexing of -1 is needed to remove ':' from end of the string
        f"{split_data[0][:-1]}": float(split_data[1]),
        # ploidy: {ploidy_value}; indexing of -1 is needed to remove ':' from end of the string
        f"{split_data[2][:-1]}": float(split_data[3]),
        # sd.BAF: {sd.BAF_value}; indexing of -1 is needed to remove ':' from end of the string
        f"{split_data[4][:-1]}": float(split_data[5]),
    }

    return json


def extract_text(path, data_unique_key, selected_folder):
    """
    Extracts text data from PDF and stores it in a dictionary for a given gamma

    Args:
        path: String, file path to PDF from inside zip folder. Example "gammas/200/sol3_0.44/"

        data_unique_key: Integer, a unique id for each solution

        selected_folder: String, name of selected data folder.
            Example: PANX_1280_Lv_M_100-PM-022_LCM2.results.zip


    Returns:
        data: Dictionary, extracted data from a PDF file
    """

    extracted_path = extract_file(path, selected_folder, "_model_fit.pdf")
    pdf = PdfFileReader(extracted_path)

    # model_fit files have one page only, hence getPage(0)
    pageObj = pdf.getPage(0)
    try:
        # extracted text
        txt = pageObj.extractText()
        # adding json format extracted data to dictionary
        data = jsonify_extracted_text(extracted_path, txt, data_unique_key)

    except:
        pass

    return data


def get_alternate_solutions(gamma, selected_folder):
    """
    Gets folder names of alternate solutions for a given gamma

    Args:
        gamma: Integer, gamma value

        selected_folder: String, name of selected data folder.
            Example: PANX_1280_Lv_M_100-PM-022_LCM2.results.zip

    Returns: List of Strings, alternate solution folder names
    """

    # List of subfolders (alternate solutions) in current directory
    with ZipFile(
        os.path.join(str(os.getenv("MALTA_DATA_FOLDER")), selected_folder), "r"
    ) as f:
        subfolders = [item.filename for item in f.infolist() if item.is_dir()]

    # List of alternate solution folders of the desired gamma
    alternate_solutions = [
        folder_name
        for folder_name in subfolders
        if "sol" in folder_name and f"/{gamma}/" in folder_name
    ]

    return alternate_solutions


def get_gamma_data(gamma, selected_folder):
    """
    Extracts all text data for a given gamma

    Args:
        gamma: Integer, gamma value

        selected_folder: String, name of selected data folder.
            Example: PANX_1280_Lv_M_100-PM-022_LCM2.results.zip

    Returns:
        data: List of dictionaries, extracted data from all model_fit files for a given gamma
    """
    data = []

    ideal_solution_data = extract_text(set_path(gamma), 0, selected_folder)
    data.append(ideal_solution_data)

    alternate_solution_folders = get_alternate_solutions(gamma, selected_folder)

    # extracting text data from every model_fit file that is in a solution subfolder
    for idx, alt_solution in enumerate(alternate_solution_folders):
        # passing in idx+1 for data_unique_key as 0 is for the ideal solution
        data.append(extract_text(alt_solution, idx + 1, selected_folder))

    return data


def get_primary_solutions_plots(selected_folder, filename):
    """
    Gets primary solutions data for a selected folder

    Args:
        selected_folder: String, name of selected data folder.
            Example: PANX_1280_Lv_M_100-PM-022_LCM2.results.zip

        filename: String, unique part of end of filename. Example: "_model_fit.pdf" in PANX_1288_Pm_M_WG_100_JHU_004_LCM3_6_model_fit.pdf

    Returns:
        data: List of Strings, each string is a filepath to a primary plot (model_fit or genome_view)
    """

    data = []
    data_path = os.path.join(os.getenv("MALTA_DATA_FOLDER"), selected_folder)
    gammas = get_gamma_options(data_path)

    for gamma in gammas:
        data.append(
            {
                "file": extract_file(set_path(gamma), selected_folder, filename),
                "gamma": gamma,
            }
        )

    return data


def extract_file(path, selected_folder, filename):
    """
    Extracts PDF from zip folder

    Args:
        path: String, file path to PDF from inside zip folder. Example "gammas/200/sol3_0.44/"

        selected_folder: String, name of selected data folder.
            Example: PANX_1280_Lv_M_100-PM-022_LCM2.results.zip

        filename: String, unique part of end of filename. Example: "_model_fit.pdf" in PANX_1288_Pm_M_WG_100_JHU_004_LCM3_6_model_fit.pdf

    Returns:
        full_path: String, full path to extracted file
    """
    with ZipFile(
        os.path.join(str(os.getenv("MALTA_DATA_FOLDER")), selected_folder), "r"
    ) as f:
        file_path = path + get_solution_name(
            selected_folder=selected_folder, filename=filename
        )
        f.extract(file_path, str(os.getenv("MALTA_DATA_FOLDER")))
        full_path = os.path.join(str(os.getenv("MALTA_DATA_FOLDER")), file_path)

    return full_path
