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
  const [gamma, setGamma] = useState<Number>(300);
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<Boolean>();
  const [images, setImages] = useState<String[]>([]);

  useEffect(() => {
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

    // setLoading(true);
  }, []);

  return (
    <>
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
