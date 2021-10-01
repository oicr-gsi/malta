import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { SubmitButton, Textbox, FormInputLabel } from "./gammaSelectionStyles";
import { DropdownMenu } from "./components/dropDownMenu";
import { ImageGrid } from "./components/imageGrid";

interface Data {
  gamma: SolutionData[];
}

interface SolutionData {
  id: Number;
  cellularity: Number;
  ploidy: Number;
  // quotes required to prevent '.' from creating an error
  "sd.BAF": Number;
  path: String;
}

export const GammaSelection = () => {
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<Boolean>();

  const [data, setData] = useState<Data>();
  const [PDF, setPDF] = useState<String>();
  const [gamma, setGamma] = useState<any>();
  const [images, setImages] = useState<any>();

  const [options, setOptions] = useState([]);
  // const [selectedPlot, setSelectedPlot] = useState(0);

  const [folders, setFolders] = useState<any>([]);
  const [selectedFolder, setSelectedFolder] = useState<any>();

  useEffect(() => {
    // if statement needed to prevent fetching on page load when gamma is not selected
    if (gamma !== undefined) {
      getData();
    }
  }, [gamma]);

  useEffect(() => {
    setLoading(true);
    fetch("/data_folders")
      .then((res) => res.json())
      .then((res) => {
        setFolders(res);
        console.log(options);
      })
      .finally(() => setLoading(false));
  }, []);

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

        for (let i = 0; i < gamma_data[`${gamma}`].length; i++) {
          fetch("/pdf", {
            method: "POST",
            body: JSON.stringify(gamma_data[`${gamma}`][i]["path"]),
          })
            .then((res) => res.blob())
            .then((blob) => {
              let objectURL = URL.createObjectURL(blob);
              pdfs.push(objectURL);
              setPDF(objectURL);
              gamma_data[`${gamma}`][i]["path"] = objectURL;
            });
        }
        setImages(pdfs);
        setData(gamma_data);
        console.log(data);
      })

      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Container style={{ paddingTop: "2vh" }}>
        <p>
          Select a gamma value to get started. Choose a solution by clicking on
          a plot. The first plot is the ideal solution.
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
            <FormInputLabel>Cellularity</FormInputLabel>
            <Textbox type="text" name="cellularity" />
          </Col>
          <Col>
            <FormInputLabel>Ploidy</FormInputLabel>
            <Textbox type="text" name="ploidy" />
          </Col>
          <Col style={{ position: "relative" }}>
            <SubmitButton>Submit</SubmitButton>
          </Col>
          {/* these three columns make row spacing even and compact*/}
          <Col></Col>
          <Col></Col>
          <Col></Col>
        </Row>
      </Container>

      {
        <Container style={{ paddingTop: "5vh" }}>
          {loading ? (
            <div style={{ paddingLeft: "2vw" }}>
              <Spinner animation="border" variant="success" />
            </div>
          ) : (
            images && <ImageGrid data={images} />
          )}
        </Container>
      }
    </>
  );
};
