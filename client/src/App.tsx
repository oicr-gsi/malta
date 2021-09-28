import React, { useState, useEffect } from "react";
import { GammaSelection } from "./gammaSelection";
import { Container } from "react-bootstrap";

function App() {
  return (
    <>
      <Container
        style={{ backgroundColor: "#ebebeb", padding: "2vh", maxWidth: "none" }}
      >
        <h3>Malta</h3>
      </Container>
      <GammaSelection />
    </>
  );
}

export default App;
