import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import { Container, Spinner, Row, Col } from "react-bootstrap";
import { FormInputLabel } from "./gammaSelectionStyles";

export const PrimarySolutionPage = (props) => {
  const [index, setIndex] = useState(0);
  const [plots, setPlots] = useState<any>();
  const [genomePlots, setGenomePlots] = useState<any>();
  const [primaryLoading, setPrimaryLoading] = useState(false);
  const [PDF, setPDF] = useState<any>();
  const { gammas, images, genomeViews } = props;

  useEffect(() => {
    if (images) {
      let pdfs = [];
      setPrimaryLoading(true);
      for (let i = 0; i < images.length; i++) {
        fetch("/pdf", {
          method: "POST",
          body: JSON.stringify(images[i]),
        })
          .then((res) => res.blob())
          .then((blob) => {
            let objectURL = URL.createObjectURL(blob);
            pdfs.push(objectURL);
          })
          .finally(() => setPrimaryLoading(false));
      }
      setPlots(pdfs);
    }
  }, [images]);

  useEffect(() => {
    if (genomeViews) {
      let graphs = [];

      for (let i = 0; i < genomeViews.length; i++) {
        fetch("/pdf", {
          method: "POST",
          body: JSON.stringify(genomeViews[i]),
        })
          .then((res) => res.blob())
          .then((blob) => {
            let object = URL.createObjectURL(blob);
            // setPDF is needed for genome view to be displayed, unsure why
            setPDF(object);
            graphs.push(object);
          });
      }
      setGenomePlots(graphs);
    }
  }, [genomeViews]);

  const handleInputChange = (e) => {
    setIndex(e.currentTarget.value);
  };

  const Plot = styled.embed`
    display: ${(props: { show: Boolean }) => (props.show ? "block" : "none")};
  `;

  return (
    <Container style={{ paddingTop: "1rem", paddingLeft: "3vw" }}>
      {primaryLoading ? (
        <Spinner animation="border" variant="success" />
      ) : (
        <>
          {gammas["data"] && (
            <FormInputLabel>Gamma: {gammas["data"][index]}</FormInputLabel>
          )}
          <br />
          <input
            onInput={handleInputChange}
            type="range"
            min="0"
            value={index}
            max="13"
            step="1"
            list="tick-list"
          />

          <datalist id="tick-list">
            {gammas["data"] ? (
              gammas["data"].map((option, key) => (
                <option key={key} value={option}>
                  {option}
                </option>
              ))
            ) : (
              <>Loading</>
            )}
          </datalist>

          <br />

          <Row>
            <Col md={4}>
              {plots &&
                plots.map((plot, key) => (
                  <Plot
                    // #toolbar=0 is needed to remove built-in pdf viewer and make it look like an image
                    src={plot + "#toolbar=0"}
                    width="400"
                    height="400"
                    key={key}
                    type="application/pdf"
                    show={key == index}
                    // must be "==" for images to show
                  />
                ))}
            </Col>
            <div style={{ width: "3rem" }}></div>
            <Col>
              {genomePlots &&
                genomePlots.map((view, key) => (
                  <div style={{ borderColor: "black" }}>
                    <Plot
                      // #toolbar=0 is needed to remove built-in pdf viewer and make it look like an image
                      src={view + "#toolbar=0"}
                      width="100%"
                      height="400"
                      key={key}
                      type="application/pdf"
                      show={key == index}
                      // must be "==" for images to show
                    />
                  </div>
                ))}
            </Col>
          </Row>
          <br />
          {/* 
          Option: place genome plots on their own row for better visibility 
          <Row>
            <Col>
              {genomePlots &&
                genomePlots.map((view, key) => (
                  <Plot
                    // #toolbar=0 is needed to remove built-in pdf viewer and make it look like an image
                    src={view + "#toolbar=0"}
                    width="100%"
                    height="500"
                    key={key}
                    type="application/pdf"
                    show={key == index}
                    // must be "==" for images to show
                  />
                ))}
            </Col>
          </Row> */}
        </>
      )}
    </Container>
  );
};
