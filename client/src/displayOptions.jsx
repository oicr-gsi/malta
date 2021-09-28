import React, { useState, useEffect } from "react";

export const DisplayOptions = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState();
  const [data, setData] = useState();
  const [gamma, setGamma] = useState(300);

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
  useEffect(() => {
    console.log(gamma);
  }, [gamma]);
  //  it works after I comment, run, uncomment and save -- weird; breaks if I refresh
  return (
    <>
      <>
        {/* {options && (
          <select>
            {options ? (
              options["options"].map((option, key) => {
                return (
                  <option value={option} key={key}>
                    {option}
                  </option>
                );
              })
            ) : (
              <>loading...</>
            )}
          </select>
        )} */}
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
            <>Loading...</>
          )}
        </select>
      </>
    </>
  );
};
