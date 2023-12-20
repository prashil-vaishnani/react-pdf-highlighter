import { Sidebar } from "./Sidebar";
import { useContext, useState } from "react";
import Down from "./Down";
import { SidebarStatus } from "../type/type";
import HighlightContextProvider, { HighlightContext } from "./context";

const App = () => {
  const [url, setUrl] = useState("");
  const { handleSidebarStatus, sidebarStatus } = useContext(HighlightContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPdfUploaded = (file: any) => {
    if (file) {
      setUrl(URL.createObjectURL(file));
      handleSidebarStatus(SidebarStatus.UPLOADED);
    } else {
      handleSidebarStatus(SidebarStatus.CAN_UPLOAD);
    }
  };

  return (
    <div className="App" style={{ display: "flex", height: "100vh" }}>
      <HighlightContextProvider>
        <Sidebar onPdfUploaded={onPdfUploaded} />
        <div style={{ height: "100vh", width: "75vw", position: "relative" }}>
          {url === "" ? (
            sidebarStatus === SidebarStatus.LOADING ? (
              <div
                style={{ height: "100vh", width: "75vw", position: "relative" }}
              >
                <p>pdf is being loaded...</p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              ></div>
            )
          ) : (
            <>
              <Down url={url} />
            </>
          )}
        </div>
      </HighlightContextProvider>
    </div>
  );
};

export default App;
