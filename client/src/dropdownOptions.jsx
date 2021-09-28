import React, { useState, useEffect } from "react";

// interface Data {
//   gamma: SolutionData[];
// }

// interface SolutionData {
//   id: Number;
//   cellularity: Number;
//   ploidy: Number;
//   // quotes required to prevent '.' from creating an error
//   "sd.BAF": Number;
//   path: String;
// }

export const DropDownOptions = () => {
  const [data, setData] = useState({});
  const [PDF, setPDF] = useState();
  const [gamma, setGamma] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [images, setImages] = useState();
  const [chosenImage, setChosenImage] = useState();

  useEffect(() => {
    getData();
  }, [gamma]);

  const getData = () => {
    setLoading(true);
    fetch(`/data/${gamma}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => setData(res[`${gamma}`][0]))
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  let temp_options = [100, 200, 400, 500, 800, 2000];
  return (
    <>
      gamma:
      <select
        value={gamma}
        onChange={(e) => {
          setGamma(e.target.value);
        }}
      >
        {temp_options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
      <br />
      <label htmlFor="ploidy">ploidy: </label>
      {data && <input type="text" name="ploidy" id="" />}
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
      {data && data[`${gamma}`].map((sol, key) => <p key={key}>{sol}</p>)}
      {/* {!loading && data && renderImages} */}
    </>
  );
};
