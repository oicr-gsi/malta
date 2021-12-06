import os
from dotenv import load_dotenv
from extraction import extract_text, get_gamma_options, get_gamma_data, set_path

load_dotenv()


def get_primary_solution_data(selected_folder):
    """
    Gets primary solution data for all values of gamma
    """
    data = {}
    path = os.path.join(str(os.getenv("MALTA_DATA_FOLDER")), selected_folder)
    for gamma in get_gamma_options(path):
        solution_data = extract_text(set_path(gamma), 0, selected_folder)
        data.update({gamma: solution_data})

    return data


def preprocess(json_data):
    for key in json_data.keys():
        # keys are gamma values
        json_data[key]["gamma"] = int(key)

    processed_data = [json_data[key] for key in json_data.keys()]
    return processed_data


data = get_primary_solution_data(selected_folder=str(os.getenv("TEST_DATA")))
data = preprocess(data)


# import pandas as pd
# df = pd.DataFrame(data)
# print(data)
# print(df.head().drop(["id", "path", "sd.BAF"], axis=1))
