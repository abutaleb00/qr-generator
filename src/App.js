import logo from "./logo.png";
import "./App.css";
import { useState } from "react";

function App() {
  const [pdfFile, setPdfFile] = useState([]);
  const [pdfLink, setPdfLink] = useState("");
  const [pdfValue, setPdfValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setPdfFile(e.target.files);
    }
  };

  const onSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const form = new FormData();
    form.append("pdfFile", pdfFile[0]);
    form.append("width", "300");
    form.append("height", "100");
    form.append("link", pdfLink);
    const options = {
      method: "POST",
    };
    options.body = form;
    fetch(
      "https://esign.digitalsignature.com.bd:4040/mqtt-1.0/genqrpdf",
      options
    )
      .then((response) => response.text())
      .then((response) => {
        setLoading(false);
        let result = response.substr(32);
        var secureUrl = result.replace("http://", "https://");
        setPdfValue(secureUrl);
        console.log("rrr", result);
      })
      .catch((err) => {
        setLoading(false);
        console.error("eeeee",err);
        setPdfValue(null)
        setError(err);
      });
  };

  return (
    <div className="App">
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <div className="d-md-inline-flex d-sm-flex justify-content align-items-center">
            <a className="navbar-brand" href="/">
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
        {pdfValue === null && (
          <form onSubmit={onSubmit}>
            <div
              className="d-flex flex-column justify-content-center align-items-center"
              style={{ border: "1px dashed gray", borderRadius: "10px" }}
            >
              <div
                className="mb-3 col-md-4"
                style={{ textAlign: "left", paddingTop: "20px" }}
              >
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
              <div
                className="mb-3 col-md-4 col-sm-12"
                style={{ textAlign: "left" }}
              >
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
                <button
                  type="submit"
                  className="btn btn-primary mb-3"
                  disabled={loading}
                >
                  {loading === true ? "Submitting....." : "Submit"}
                </button>
              </div>
            </div>
          </form>
        )}
        {pdfValue !== null && (
          <div
            className="mb-12 col-md-12 mt-2 col-sm-12"
            style={{ textAlign: "right" }}
          >
            <button
              className="btn btn-success mb-3"
              style={{ color: "white" }}
              onClick={() => {
                setPdfValue(null);
              }}
            >
              Upload Another PDF
            </button>
          </div>
        )}
        {error && (
          <div>
            <p>{error}</p>
          </div>
        )}
        {pdfValue !== null && (
          <div>
            <iframe
              id="pdf-viewer"
              src={pdfValue}
              width="100%"
              height="600px"
              style={{ border: "none" }}
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
