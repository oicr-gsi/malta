import React, { useEffect } from "react";
import { GammaSelection } from "./components/gammaSelection";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Theme } from "./globalStyles";

const App = () => {
  const { gray } = Theme;
  useEffect(() => {
    // add event listener when page loads
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      // just before page is closed, remove event listener and call cleanup route
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const handleUnload = () =>
    fetch("/cleanup", {
      method: "POST",
    }).then((res) => console.log(res));

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
    </>
  );
};

export default App;
