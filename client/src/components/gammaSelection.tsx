import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

import { SubmitButton, Textbox, FormInputLabel } from "./gammaSelectionStyles";
import { DropdownMenu } from "./dropDownMenu";
import { ImageGrid } from "./imageGrid";
import { PrimarySolutionPage } from "./primarySolutionPage";

interface Data {
  gamma: SolutionData[];
}

interface SolutionData {
  id: Number;
  cellularity: Number;
  ploidy: Number;
  // quotes required to prevent '.' in sd.BAF from throwing an error
  "sd.BAF": Number;
  path: String;
}

export const GammaSelection = () => {
  // state variables for async operations
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<Boolean>();

  // state variables for dropdown menu options
  const [gammaOptions, setGammaOptions] = useState<Number[]>([]);
  const [folders, setFolders] = useState<String[]>([]);

  // state variables for images display and plot data; all fields of data are currently not used, but will be needed when auto-populating fields
  // eslint-disable-next-line
  const [data, setData] = useState<Data>();
  // PDF variable is needed for images to render on UI
  // eslint-disable-next-line
  const [PDF, setPDF] = useState<String>();
  const [images, setImages] = useState<String[]>();

  // state variables for submitting to database
  const [selectedFolder, setSelectedFolder] = useState<String>();
  const [gamma, setGamma] = useState<Number>();
  const [cellularity, setCellularity] = useState<String>();
  const [ploidy, setPloidy] = useState<String>();

  const [primaryPlots, setPrimaryPlots] = useState<String[]>([]);

  // fetches available sequenza data folders on page load
  useEffect(() => {
    setLoading(true);
    fetch("/data_folders")
      .then((res) => res.json())
      .then((res) => {
        setFolders(res);
      })
      .finally(() => setLoading(false));
  }, []);

  // fetches gamma options for the selected data folder
  useEffect(() => {
    // if statement needed to prevent fetching on page load when folder is not selected
    if (selectedFolder) {
      fetch(`/selected_folder/${selectedFolder}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((res) => setGammaOptions(res));
    }
  }, [selectedFolder]);

  // fetches plots and data every time gamma changes
  useEffect(() => {
    // get data once gamma is selected
    if (gamma) {
      getData();
    }
  }, [gamma]);

  useEffect(() => {
    if (selectedFolder) {
      fetch(`/primary/${selectedFolder}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((res) => {
          setPrimaryPlots(res);
        });
    }
  }, [selectedFolder]);

  // fetches plots and data for a selected gamma
  const getData = () => {
    let pdfs = [];
    let gamma_data;

    setLoading(true);
    fetch(`/data/${gamma}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        gamma_data = res;
        // iterating over each solution to fetch its plot
        for (let i = 0; i < gamma_data[`${gamma}`].length; i++) {
          fetch("/pdf", {
            method: "POST",
            body: JSON.stringify(gamma_data[`${gamma}`][i]["path"]),
          })
            .then((res) => res.blob())
            .then((blob) => {
              let objectURL = URL.createObjectURL(blob);
              pdfs.push(objectURL);
              // rewriting OS path to PDF to the blob URL
              gamma_data[`${gamma}`][i]["path"] = objectURL;
              // this line is needed for images to render on UI
              setPDF(objectURL);
            });
        }
        setImages(pdfs);
        setData(gamma_data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // submits selected parameters to database
  const handleFormSubmit = () => {
    // casting form fields, which are Strings, to Number type before submitting
    let gamma_submit = Number(gamma);
    let cellularity_submit = Number(cellularity);
    let ploidy_submit = Number(ploidy);
    // submit to DB
    console.log({
      "selected-folder": selectedFolder,
      gamma: gamma_submit,
      cellularity: cellularity_submit,
      ploidy: ploidy_submit,
    });
    // after submission to db, show this alert
    toast.success("Submitted to database", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
    });
  };

  return (
    <>
      <Container
        style={{ paddingRight: "3vw", paddingLeft: "3vw", paddingTop: "2vh" }}
      >
        <p style={{ fontSize: "16px" }}>
          Select a folder to get started.{" "}
          {selectedFolder && (
            <>
              Use the slider to see primary solutions for different gammas.
              Choose a value from the Gamma dropdown to see the all solutions
              for that gamma.
            </>
          )}
        </p>
      </Container>
      <Container style={{ paddingRight: "3vw", paddingLeft: "3vw" }}>
        <Row>
          <Col>
            <DropdownMenu
              label="Select Folder"
              value={selectedFolder}
              setValue={setSelectedFolder}
              data={folders}
            />
          </Col>

          {selectedFolder && (
            <Col>
              <DropdownMenu
                label="Gamma"
                value={gamma}
                setValue={setGamma}
                data={gammaOptions}
              />
            </Col>
          )}
        </Row>

        <Row>
          <Col>
            <FormInputLabel htmlFor="cellularity">Cellularity</FormInputLabel>
            <Textbox
              type="text"
              name="cellularity"
              id="cellularity"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCellularity(e.target.value)
              }
            />
          </Col>
          <Col>
            <FormInputLabel htmlFor="ploidy">Ploidy</FormInputLabel>
            <Textbox
              type="text"
              name="ploidy"
              id="ploidy"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPloidy(e.target.value)
              }
            />
          </Col>
          <Col style={{ position: "relative" }}>
            <SubmitButton
              disabled={!(cellularity && ploidy)}
              onClick={handleFormSubmit}
            >
              Submit
            </SubmitButton>
            <ToastContainer />
          </Col>
          {/* these three columns make row spacing even and compact*/}
          <Col></Col>
          <Col></Col>
          <Col></Col>
        </Row>
      </Container>

      {selectedFolder && (
        <PrimarySolutionPage
          gammas={gammaOptions}
          primaryPlotImagePaths={primaryPlots["model_fit"]}
          genomeViewsPaths={primaryPlots["genome_view"]}
        />
      )}
      <br />
      <Container style={{ paddingTop: "2vh" }}>
        {loading ? (
          <div style={{ paddingLeft: "2vw" }}>
            <Spinner animation="border" variant="success" />
          </div>
        ) : (
          images && <ImageGrid data={images} />
        )}
      </Container>
    </>
  );
};
