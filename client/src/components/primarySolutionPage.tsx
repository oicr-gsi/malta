import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import { Container, Spinner } from "react-bootstrap";
import { FormInputLabel } from "./gammaSelectionStyles";

export const PrimarySolutionPage = (props) => {
  const [index, setIndex] = useState(0);
  const [plots, setPlots] = useState<any>();
  const [primaryLoading, setPrimaryLoading] = useState(false);

  const { gammas, images } = props;

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

  const handleInputChange = (e) => {
    setIndex(e.currentTarget.value);
  };

  const Plot = styled.embed`
    display: ${(props) => (props.show ? "block" : "none")};
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
          {plots &&
            plots.map((plot, key) => (
              <Plot
                // #toolbar=0 is needed to remove built-in pdf viewer and make it look like an image
                src={plot + "#toolbar=0"}
                width="500"
                height="500"
                key={key}
                type="application/pdf"
                show={key == index}
                // must be "==" for images to show
              />
            ))}
        </>
      )}
    </Container>
  );
};
