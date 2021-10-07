import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export const PrimarySolutionPage = (props) => {
  const [values, setValues] = useState([1, 3, 5, 10, 20, 50, 100]);
  const [index, setIndex] = useState(0);
  const [plots, setPlots] = useState<any>();
  const [PDF, setPDF] = useState<any>();

  const { gammas, images } = props;

  useEffect(() => {
    if (images) {
      let pdfs = [];
      for (let i = 0; i < images.length; i++) {
        fetch("/pdf", {
          method: "POST",
          body: JSON.stringify(images[i]),
        })
          .then((res) => res.blob())
          .then((blob) => {
            let objectURL = URL.createObjectURL(blob);
            pdfs.push(objectURL);
            // this line is needed for images to render on UI
            setPDF(objectURL);
          });
      }
      setPlots(pdfs);
    }
  }, []);

  const handleInputChange = (e) => {
    setIndex(e.currentTarget.value);
  };

  return (
    <div>
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
      {gammas["data"] ? (
        <span id="output">{gammas["data"][index]}</span>
      ) : (
        <></>
      )}
      <br />
      {images ? <span id="output">{images[index]}</span> : <></>}
      {plots ? (
        <embed
          // #toolbar=0 is needed to remove built-in pdf viewer and make it look like an image
          src={plots[index] + "#toolbar=0"}
          width="500"
          height="500"
          //   type="application/pdf"
        />
      ) : (
        <></>
      )}
    </div>
  );
};
