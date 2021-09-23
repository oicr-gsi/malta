import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { DropdownButton, Dropdown, Button } from "react-bootstrap";

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
  const [gamma, setGamma] = useState<any>();
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<Boolean>();
  const [images, setImages] = useState<String[]>([]);

  const gammaOptions = [
    50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1250, 1500, 2000,
  ];

  const getData = (selectedGamma: Number) => {
    let pdfs = [];

    setLoading(true);
    fetch(`/data/${selectedGamma}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
        for (let i = 0; i < data[`${selectedGamma}`].length; i++) {
          fetch("/pdf", {
            method: "POST",
            body: JSON.stringify(data[`${selectedGamma}`][i]["path"]),
          })
            .then((res) => res.blob())
            .then((blob) => {
              let objectURL = URL.createObjectURL(blob);
              pdfs.push(objectURL);
              setPDF(objectURL);
            });
          setImages(pdfs);
        }
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSelect = (e) => {
    e.preventDefault();
    setGamma(e.target.value);
    console.log("after change:", gamma);
    getData(gamma);
  };

  return (
    <>
      {/* <DropdownButton title="Select Gamma" onSelect={handleSelect}>
        {gammaOptions.map((option, i) => (
          <Dropdown.Item eventKey={`${option}`} key={i}>
            {option}
          </Dropdown.Item>
        ))}
      </DropdownButton> */}
      <select name="select gamma" id="dropdown" onChange={handleSelect}>
        {gammaOptions &&
          gammaOptions.map((option, i) => (
            <option value={`${option}`} key={i}>
              {option}
            </option>
          ))}
      </select>
      {`gamma: ${gamma}`}
      {loading ? (
        <p>Loading...</p>
      ) : (
        !loading &&
        data &&
        data[`${gamma}`].map((sol: any, i) => (
          <p key={i}>{`cellularity: ${sol["cellularity"]}`}</p>
        ))
      )}

      {!loading &&
        images &&
        images.map((image, i) => (
          <embed
            // #toolbar=0 is needed to remove built-in pdf viewer and make it look like an image
            src={image + "#toolbar=0"}
            width="350"
            height="350"
            type="application/pdf"
            key={i}
          />
        ))}
    </>
  );
};
