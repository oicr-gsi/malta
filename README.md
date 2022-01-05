# Malta

Interface and tracking for clinical report generation

## Introduction

The Clinical Genome Informatics (CGI) group at [OICR](https://oicr.on.ca) produces _clinical reports_ on bioinformatics analysis for cancer patients.

The purpose of Malta is:

1. Provide an interface for selecting parameters in clinical reports
2. Track parameters used to generate reports in a database

Malta is complementary to [Djerba](https://github.com/oicr-gsi/djerba), which generates reports from workflow outputs, metadata, and user-selected parameters. It is the successor to [Elba](https://github.com/oicr-gsi/elba), a prototype project which had similar goals but became outdated.

Malta is named for the [island nation](https://en.wikipedia.org/wiki/Malta) in the Mediterranean Sea.

## Sequenza parameter selection

A key step in CGI report generation is choosing from the solutions offered by the Sequenza tool, which in turn determines the purity and ploidy metrics. Manual evaluation of solutions requires clicking through PDF files from a ZIP archive. Malta will provide a more efficient interface for this task, and store the chosen parameters in a database.

## Setup and Local Development

### Inputs

There are a few environment variables stored in an `.env` file, in the root directory (needs to be created by developer). The `.env` file ("dotenv") is a simple text format used to define variables that are needed for the application's environment. Documentation for dotenv files can be found [here](https://hexdocs.pm/dotenvy/dotenv-file-format.html).

The following are ordered by the likelihood that they need to be configured by the developer.
| Field | Type| Description |
--------|---- | ----------- |
MALTA_DATA_FOLDER | `String` | Path to folder that contains Sequenza zipfiles
MALTA_OUTPUT_FOLDER | `String` | Path to where extracted files are written to
MALTA_DROPDOWN_COUNT | `Integer` | Number of folders available in "Select folder" dropdown
MALTA_STUDIES | `String`, (later on `List[str]`) | Desired studies. For now, only `PASS01`
MALTA_LATEST_PROVENANCE | String | Path to latest provenance `.tsv.gz` file
MALTA_SECRET_KEY | `String` | Key for Flask app to use `session`, required in order to store the selected folder's name across HTTP requests
MALTA_TEST_DATA | `String` | Name of zip used for unit tests: Currently PANX_1280_Lv_M_100-PM-022_LCM2.results.zip

Example of a completed `.env` file for Malta can be found [here](/example/example.env).

### Running locally

There are two components that need to be run, the Flask server and React front-end. To run the Flask app, change directory into flask-server/ and run server.py:

`cd flask-server`

`python server.py`

The server will be running on `http://localhost:5000/`.

To run the React front-end:

`cd client`

`npm install` (only the first time for setting up). This installs the necessary modules and dependencies for the React app.

`npm start`

The app should be visible on `http://localhost:3000/`.

## Unit tests

### On HPC Cluster:

1. Load `module load python/3.9`

2. Clone the repository and `cd malta`

3. Create a `.env` file and fill it with the required inputs from above. Ensure that it is in the root directory.

4. `pip install --prefix $INSTALL_DIR`

5. Then update `PATH` and `PYTHONPATH` accordingly:

   - export` PATH=$INSTALL_DIR/bin:$PATH`

   - export `PYTHONPATH=$INSTALL_DIR/lib/$PYTHON_VERSION/site-packages:$PYTHONPATH`, where for ex.` $PYTHON_VERSION=python3.8`

6. Run the setup script: `python3 setup.py install`

- `cd flask-server` and run `python3 test_extraction.py`

<br />

### On local machine:

- `cd flask-server`

- run `python test_extraction.py` or `python3 test_extraction.py` depending on your OS.

To test the flask server:

- `cd flask-server`

- run `python test_server.py` or `python3 test_server.py` depending on your OS.

## Future work

After Sequenza parameter selection has been implemented, Malta can be built out to provide an interface for other reporting parameters, and to store Djerba configuration files in its database.

### Query Provenance script

`query_provenance.py` is a script to create symlinks to the latest Sequenza zip folders.

### Setting up on Malta VM

- sudo apt get npm

- follow [steps 4-6](https://github.com/oicr-gsi/malta/blob/95ca8dd19708b37fc68e475203ffcb5753a01e08/README.md#L63) for HPC Cluster

  - install pip3 if it already isn't

- manually `pip3 install flask`

- add `WSGIPythonPath /home/ubuntu/install-dependencies/lib/python3.8/site-packages` to `apache2.conf` so python modules can be found

- had to pip3 install all the dependencies anyways -- **needs to be investigated**

## Copyright and License

Copyright (C) 2021 by Genome Sequence Informatics, Ontario Institute for Cancer Research.

Licensed under the [GPL 3.0 license](https://www.gnu.org/licenses/gpl-3.0.en.html).
