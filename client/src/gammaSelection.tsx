import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  SubmitButton,
  Textbox,
  FormInputLabel,
  DropdownLabel,
  Dropdown,
  DropdownOption,
} from "./gammaSelectionStyles";

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
  const [data, setData] = useState<Data>();
  const [PDF, setPDF] = useState<String>();
  const [gamma, setGamma] = useState<any>(100);
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<Boolean>();
  const [images, setImages] = useState<any>();
  const [options, setOptions] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState(0);

  useEffect(() => {
    getData();
  }, [gamma]);

  useEffect(() => {
    setLoading(true);
    fetch("/gamma_options")
      .then((res) => res.json())
      .then((res) => {
        setOptions(res);
        console.log(options);
      })
      .finally(() => setLoading(false));
  }, []);

  // useEffect(() => {
  //   console.log(gamma);
  // }, [gamma]);

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

  let renderImages;
  if (images) {
    renderImages = images.map((image, i) => (
      <span
        style={{ padding: "2vw" }}
        onClick={() => {
          setSelectedPlot(i);
          console.log(selectedPlot);
        }}
      >
        <embed
          // #toolbar=0 is needed to remove built-in pdf viewer and make it look like an image
          src={image + "#toolbar=0"}
          width="500"
          height="500"
          type="application/pdf"
          key={i}
        />
      </span>
    ));
  }

  // if (data) {
  //   renderImages = data[`${gamma}`].map((solution, i) => (
  //     <embed
  //       // #toolbar=0 is needed to remove built-in pdf viewer and make it look like an image
  //       src={solution["path"] + "#toolbar=0"}
  //       width="350"
  //       height="350"
  //       type="application/pdf"
  //       key={i}
  //     />
  //   ));
  // }
  const files = ["file1", "file2"];

  return (
    <>
      {/* choose file
      <select name="choose file" id="">
        {files.map((file, key) => (
          <option key={key} value={file}>
            {file}
          </option>
        ))}
      </select>
      <br /> */}

      <Container style={{ paddingTop: "2vh" }}>
        <p>
          Select a gamma value to get started. Choose a solution by clicking on
          a plot.
          {/* gamma represents how much DNA was chopped; each plot is a local max/min; djerba will query DB; dont worry too much about clicking on an image*/}
        </p>
        <Row>
          <Col style={{ textAlign: "center" }}>
            <DropdownLabel>Gamma</DropdownLabel>
            <br />
            <Dropdown
              value={gamma}
              onChange={(e) => {
                setGamma(e.target.value);
              }}
            >
              {options[`options`] ? (
                options[`options`].map((option, key) => (
                  <>
                    <DropdownOption key={key} value={option}>
                      {option}
                    </DropdownOption>
                    {/* <hr style={{ color: "blue" }} /> */}
                  </>
                ))
              ) : (
                <>loading...</>
              )}
            </Dropdown>
          </Col>
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
        </Row>
      </Container>
      <br />
      {
        <Container style={{ paddingTop: "5vh" }}>
          {loading ? (
            <Spinner animation="border" variant="success" />
          ) : (
            images && renderImages
          )}
        </Container>
      }
    </>
  );
};
