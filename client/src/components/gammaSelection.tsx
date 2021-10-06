import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { SubmitButton, Textbox, FormInputLabel } from "./gammaSelectionStyles";
import { DropdownMenu } from "./dropDownMenu";
import { ImageGrid } from "./imageGrid";

interface Data {
  gamma: SolutionData[];
}

interface SolutionData {
  id: Number;
  cellularity: Number;
  ploidy: Number;
  // quotes required to prevent '.' in sd.BAF from creating an error
  "sd.BAF": Number;
  path: String;
}

export const GammaSelection = () => {
  // state variables for async operations
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<Boolean>();

  // state variables for dropdown menu options
  const [options, setOptions] = useState<Number[]>([]);
  const [folders, setFolders] = useState<String[]>([]);

  // state variables for images display and plot data
  const [data, setData] = useState<Data>();
  const [PDF, setPDF] = useState<String>();
  const [images, setImages] = useState<String[]>();

  // state variables for submitting to database
  const [selectedFolder, setSelectedFolder] = useState<any>();
  const [gamma, setGamma] = useState<Number>();
  const [cellularity, setCellularity] = useState<String>();
  const [ploidy, setPloidy] = useState<String>();

  // fetches available data folders on page load
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
        .then((res) => setOptions(res));
    }
  }, [selectedFolder]);

  // fetches plots and data every time gamma changes
  useEffect(() => {
    // if statement needed to prevent fetching on page load when gamma is not selected
    if (gamma !== undefined) {
      getData();
    }
  }, [gamma]);

  // fetches plots and data
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
    console.log({
      "selected-folder": selectedFolder,
      gamma: gamma_submit,
      cellularity: cellularity_submit,
      ploidy: ploidy_submit,
    });
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
      <Container style={{ paddingTop: "2vh" }}>
        <p>
          Select a gamma value to get started. Choose a solution by clicking on
          a plot. {images && <>The first plot is the primary solution.</>}
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
                data={options}
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
              disabled={!cellularity || !ploidy}
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

      <Container style={{ paddingTop: "5vh" }}>
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
