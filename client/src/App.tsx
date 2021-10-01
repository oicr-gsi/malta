import React, { useState, useEffect } from "react";
import { GammaSelection } from "./components/gammaSelection";
import { Container } from "react-bootstrap";
import { Theme } from "./globalStyles";

function App() {
  const { gray } = Theme;
  return (
    <>
      <Container
        style={{ backgroundColor: gray, padding: "2vh", maxWidth: "none" }}
      >
        <h3>Malta</h3>
      </Container>
      <GammaSelection />
    </>
  );
}

export default App;
