#! /usr/bin/env python3
import os
import pandas as pd
from dotenv import load_dotenv


def main():
    """
    Script to parse file provenance, find latest zip files,
    and create a folder with symlinks to those zips.

    Will need to run this script with a cron job or Shesmu olive
    periodically to provide Malta with latest/relevant cases.
    """
    load_dotenv()

    # will have to do some manipulation when multiple studies are in env file.
    # Ex. separate study names by "|" in env file and split by "|" here to create list of studies
    STUDIES = (
        os.getenv("MALTA_STUDIES").split()
        if os.getenv("MALTA_STUDIES") != None
        else ["PASS01"]
    )
    dropdown_count = (
        int(os.getenv("MALTA_DROPDOWN_COUNT"))
        if os.getenv("MALTA_DROPDOWN_COUNT") != None
        else 15
    )
    provenance_file = str(os.getenv("LATEST_PROVENANCE"))

    # turn off SettingWithCopy warning thrown by false positive dataframe copies
    pd.options.mode.chained_assignment = None

    # relevant only when using a reduced file: cut -f 1,2,31,47
    # column_names = ["Last Modified", "Study Title", "Workflow Name", "File Path"]
    df = pd.read_csv(provenance_file, delimiter="\t")

    # filter by workflow name, only sequenza output
    df.loc[df["Workflow Name"] == "sequenza", :]

    # filter by zip files
    zips = df[df["File Path"].str.contains("_results.zip")]

    # convert to date-time
    zips.loc[:, "Last Modified"] = pd.to_datetime(zips["Last Modified"])

    # sort by most recent
    zips.sort_values(by=["Last Modified"], inplace=True, ascending=False)

    # filter by desired studies
    for study in STUDIES:
        zips = zips[zips["Study Title"] == study]

    # creating a column of names extracted from file path
    zips["Name"] = zips["File Path"].apply(lambda x: x.split("/")[-1])

    # take only unique names
    unique = zips.drop_duplicates(subset=["Name"])

    # # convert relevant columns to lists for easier use
    names = list(unique["Name"].head(dropdown_count))
    paths = list(unique["File Path"].head(dropdown_count))

    os.mkdir("./malta_data")
    os.chdir("./malta_data")
    for i in range(dropdown_count):
        os.symlink(paths[i], names[i])


if __name__ == "__main__":
    main()
