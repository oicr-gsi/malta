import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Screen } from "./Screen";

interface Members {
  members: String[];
}

function App() {
  const [data, setData] = useState<Members>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    setLoading(true);
    fetch("/pdf")
      .then((res) => {
        res.json();
        console.log(res);
        setData(data);
        console.log(data);
      })
      .then((data) => {
        // setData(data);
        // console.log(data);
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
      {/* <ul>
        {data && data["members"].map((item, idx) => <li key={idx}>{item}</li>)}
      </ul> */}
      <>hi</>
      <br />
      <Screen />
    </>
  );
}

export default App;
