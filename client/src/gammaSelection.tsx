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
  const [gamma, setGamma] = useState<any>(100);
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<Boolean>();
  const [images, setImages] = useState<any>();
  const [options, setOptions] = useState([]);

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
      <embed
        // #toolbar=0 is needed to remove built-in pdf viewer and make it look like an image
        src={image + "#toolbar=0"}
        width="500"
        height="500"
        type="application/pdf"
        key={i}
      />
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
  return (
    <>
      gamma:
      <select
        value={gamma}
        onChange={(e) => {
          setGamma(e.target.value);
        }}
      >
        {options[`options`] ? (
          options[`options`].map((option, key) => (
            <option key={key} value={option}>
              {option}
            </option>
          ))
        ) : (
          <>loading...</>
        )}
      </select>
      <br />
      <label htmlFor="ploidy">ploidy: </label>
      <input type="text" name="ploidy" id="" />
      <br />
      <label htmlFor="cellularity">cellularity:</label>
      <input type="text" name="cellularity" id="" />
      <br />
      <br />
      <br />
      {images && renderImages}
      {/* {!loading && data && renderImages} */}
    </>
  );
};
