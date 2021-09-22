import React, { useState, useEffect } from "react";
import { Screen } from "./Screen";

interface Members {
  members: String[];
}

function App() {
  const [data, setData] = useState<Members>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    // setLoading(true);
    // fetch("/pdf")
    //   .then((res) => {
    //     res.json();
    //     console.log(res);
    //   })
    //   .then((data) => {
    //     setData(data);
    //     console.log(data);
    //   })
    //   .catch((err) => {
    //     setError(err);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
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
