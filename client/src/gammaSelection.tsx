import React, { useState, useEffect } from "react";

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
  const [images, setImages] = useState<any>();

  useEffect(() => {
    getData();
  }, [gamma]);

  const getData = () => {
    let pdfs = [];

    setLoading(true);
    fetch(`/data/${gamma}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
        for (let i = 0; i < data[`${gamma}`].length; i++) {
          fetch("/pdf", {
            method: "POST",
            body: JSON.stringify(data[`${gamma}`][i]["path"]),
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
  let renderImages;
  if (images) {
    renderImages = images.map((image, i) => (
      <embed
        // #toolbar=0 is needed to remove built-in pdf viewer and make it look like an image
        src={image + "#toolbar=0"}
        width="350"
        height="350"
        type="application/pdf"
        key={i}
      />
    ));
  }
  let displayData;
  // if (data) {
  //   displayData = data[`${gamma}`].map((sol: any, i) => (
  //     <p key={i}>{`cellularity: ${sol["cellularity"]}`}</p>
  //   ));
  // }
  let options = [100, 200, 400, 500, 800, 2000];
  return (
    <>
      {/* {`gamma: ${gamma}`} */}
      gamma:
      <select
        value={gamma}
        onChange={(e) => {
          setGamma(e.target.value);
        }}
      >
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
      <br />
      <label htmlFor="ploidy">ploidy: </label>
      <input type="text" name="ploidy" id="" />
      <br />
      <label htmlFor="cellularity">cellularity:</label>
      <input type="text" name="cellularity" id="" />
      <br />
      <label htmlFor="sd.BAF">sd.BAF: </label>
      <input type="text" name="sd.BAF" id="" />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      {/* <select name="select" id="">
        <option value="300">300</option>
        <option value="400">400</option>
        <option value="500">500</option>
      </select> */}
      {images && renderImages}
    </>
  );
};
