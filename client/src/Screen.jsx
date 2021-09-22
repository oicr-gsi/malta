import { pbkdf2Sync } from "crypto";
import React, { useState, useEffect } from "react";

export const Screen = () => {
  const [data, setData] = useState();
  const [PDF, setPDF] = useState();
  const [gamma, setGamma] = useState(300);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [images, setImages] = useState([]);

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
      {PDF && (
        <object data={PDF} width="500" height="500" type="application/pdf" />
      )}
      {`gamma: ${gamma}`}
      {data &&
        data[`${gamma}`].map((sol, i) => (
          <p key={i}>{`cellularity: ${sol["cellularity"]}`}</p>
        ))}

      {images &&
        images.map((image, i) => (
          <object
            data={image}
            width="500"
            height="500"
            type="application/pdf"
            key={i}
          />
        ))}
    </>
  );
};
