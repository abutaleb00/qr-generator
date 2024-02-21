import logo from "./logo.png";
import "./App.css";
import { useState } from "react";

function App() {
  const [pdfFile, setPdfFile] = useState([]);
  const [pdfLink, setPdfLink] = useState("");
  const [pdfValue, setPdfValue] = useState(null);

  const handleFileChange = (e) => {
    console.log("e", e);
    if (e.target.files) {
      setPdfFile(e.target.files);
      console.log("file", e.target.files);
    }
  };
  // const pdfGenerate = (e) =>{
  //   fetch(e, {
  //     mode: 'no-cors'
  //   })
  //   .then(response => response.blob())
  //   .then(blob => {
  //     // Do something with the PDF blob, like displaying it in an <embed> element
  //     const url = URL.createObjectURL(blob);
  //     // Example: Display PDF in an <embed> element
  //     document.getElementById('pdf-viewer').setAttribute('src', url);
  //     console.log("url",url)
  //   })
  //   .catch(error => {
  //     console.error('Error fetching PDF:', error);
  //   });
  // }
  const pdfGenerate = (e) =>{
    const requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
    };
    
    fetch(e, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setPdfValue(result)
        console.log("res 2", result)})
      .catch((error) => console.error(error));
  }
  const onSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("pdfFile", pdfFile[0]);
    form.append("width", "300");
    form.append("height", "100");
    form.append("link", pdfLink);

    const options = {
      method: "POST",
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    };
    options.body = form;
    fetch(
      "https://esign.digitalsignature.com.bd:4040/mqtt-1.0/genqrpdf",
      options
    )
      .then((response) => response.text())
      .then((response) => {
        let result = response.substr(32)
        pdfGenerate(result)
        console.log(result)
      })
      .catch((err) => console.error(err));
  };
  return (
    <div className="App">
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <div className="d-md-inline-flex d-sm-flex justify-content align-items-center">
            <a className="navbar-brand" href="#">
              <img
                src={logo}
                alt=""
                width="250"
                // height="24"
                className="d-inline-block align-text-top"
              />
            </a>
            <p
              style={{
                marginBottom: "0px",
                fontSize: "28px",
                fontWeight: "bold",
              }}
            >
              Commlink QR Generator
            </p>
          </div>
        </div>
      </nav>
      <div className="container-fluid mt-5">
        <form onSubmit={onSubmit}>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="mb-3 col-md-4" style={{ textAlign: "left" }}>
              <label htmlFor="formFile" className="form-label">
                Select PDF
              </label>
              <input
                className="form-control"
                accept="application/pdf"
                type="file"
                id="formFile"
                onChange={(e) => handleFileChange(e)}
              />
            </div>
            <div className="mb-3 col-md-4 col-sm-12" style={{ textAlign: "left" }}>
              <label htmlFor="qrlink" className="form-label">
                QR Link
              </label>
              <input
                className="form-control"
                type="text"
                name="qrlink"
                placeholder="Enter Link"
                onChange={(e) => setPdfLink(e.target.value)}
              />
            </div>
            <div className="mb-3 col-md-4 mt-2 col-sm-12">
              <button type="submit" className="btn btn-primary mb-3">
                Submit
              </button>
            </div>
          </div>
        </form>
        {pdfValue !== null &&
        <div>
        <iframe id="pdf-viewer" src={pdfValue} width="100%" height="600px" style={{border: "none"}}></iframe>
        </div>
}
      </div>
    </div>
  );
}

export default App;
