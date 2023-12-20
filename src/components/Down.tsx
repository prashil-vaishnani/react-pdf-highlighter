import { PdfLoader } from "react-pdf-highlighter";
import Child from "./Child";

const Down = ({
  url,
}: {
  url: string;
}) => {
  return (
    <>
      <PdfLoader
        url={url}
        beforeLoad={
          <div style={{ height: "100vh", width: "75vw", position: "relative" }}>
            <p>Resume is being loaded...</p>
          </div>
        }
      >
        {(pdfDocument) => (
          <Child
            pdfDocument={pdfDocument}
          />
        )}
      </PdfLoader>
    </>
  );
};

export default Down;
