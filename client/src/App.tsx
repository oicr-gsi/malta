import React, { useState, useEffect } from "react";
import { GammaSelection } from "./components/gammaSelection";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Theme } from "./globalStyles";
import { PrimarySolutionPage } from "./components/primarySolutionPage";

const App = () => {
  const { gray } = Theme;
  return (
    <>
      <Container
        style={{ backgroundColor: gray, padding: "2vh", maxWidth: "none" }}
      >
        <div>
          <img src="OICR_logo.png" alt="OICR" height="65" width="90" />

          <h2 style={{ display: "inline", marginLeft: "1.25rem" }}>Malta</h2>
        </div>
      </Container>
      <GammaSelection />
      {/* <PrimarySolutionPage /> */}
    </>
  );
};

export default App;
