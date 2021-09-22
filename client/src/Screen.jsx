import React, { useState, useEffect } from "react";

export const Screen = () => {
  const [data, setData] = useState();
  const [PDF, setPDF] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    setLoading(true);
    fetch("/data")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
    // , {
    //   headers: {
    //     "Response-Type": "Blob",
    //   },
    // }
    setLoading(true);
    fetch("/pdf")
      .then((res) => res.blob())
      .then((blob) => {
        let objectURL = URL.createObjectURL(blob);
        setPDF(objectURL);
      })

      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      {PDF && (
        <object data={PDF} width="500" height="500" type="application/pdf" />
      )}
      gamma: 400
      {data &&
        data["400"].map((sol, i) => (
          <p key={i}>{`cellularity: ${sol["cellularity"]}`}</p>
        ))}
    </>
  );
};
