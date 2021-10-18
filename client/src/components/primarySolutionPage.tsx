import React, { useState, useEffect, Key } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import { Container, Spinner, Row, Col } from "react-bootstrap";
import { FormInputLabel } from "./gammaSelectionStyles";

interface PrimarySolutionPageProps {
  gammas: Number[];
  primaryPlotImagePaths: String[];
  genomeViewsPaths: String[];
}

const Plot = styled.embed`
  display: ${(props: { show: Boolean }) => (props.show ? "block" : "none")};
`;

export const PrimarySolutionPage = (props: PrimarySolutionPageProps) => {
  const [index, setIndex] = useState(0);
  const [plots, setPlots] = useState<String[]>();
  const [genomePlots, setGenomePlots] = useState<String[]>();
  const [primaryLoading, setPrimaryLoading] = useState(false);
  // PDF variable is needed for images to render on UI
  // eslint-disable-next-line
  const [PDF, setPDF] = useState<String>();

  const { gammas, primaryPlotImagePaths, genomeViewsPaths } = props;

  useEffect(() => {
    getImagesFromPaths(primaryPlotImagePaths, setPlots, setPrimaryLoading);
  }, [primaryPlotImagePaths]);

  useEffect(() => {
    getImagesFromPaths(genomeViewsPaths, setGenomePlots, setPrimaryLoading);
  }, [genomeViewsPaths]);

  const getImagesFromPaths = (
    data: String[],
    setValue: (value: String[]) => void,
    setLoading: React.Dispatch<React.SetStateAction<Boolean>>
  ) => {
    if (data) {
      let temp = [];
      setLoading(true);
      for (let i = 0; i < data.length; i++) {
        fetch("/pdf", {
          method: "POST",
          body: JSON.stringify(data[i]),
        })
          .then((res) => res.blob())
          .then((blob) => {
            let object = URL.createObjectURL(blob);
            // setPDF is needed for genome view to be displayed, unsure why
            setPDF(object);
            temp.push(object);
          })
          .finally(() => setLoading(false));
      }
      setValue(temp);
    }
  };

  const handleInputChange = (e) => {
    setIndex(e.currentTarget.value);
  };

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
              gammas["data"].map((option, key: Key) => (
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
            {/* space between primary and genome view plots */}
            <div style={{ width: "3rem" }}></div>
            <Col>
              {genomePlots &&
                genomePlots.map((view, key) => (
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
                ))}
            </Col>
          </Row>
          <br />
        </>
      )}
    </Container>
  );
};
