import { useCallback, useEffect, useMemo, useState } from "react";
import type { IHighlight, NewHighlight, Scaled } from "react-pdf-highlighter";
import {
  AreaHighlight,
  Highlight,
  PdfHighlighter,
  PdfLoader,
  Popup,
  Tip,
} from "react-pdf-highlighter";
import { Sidebar, SidebarStatus } from "./Sidebar";
import { HighlightPopup } from "./HighlightPopup";
import { generateCommentId } from "../utils/id-generator";
import URLwithStore from "../utils/url-extensions";
import "../style/App.css";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let scrollViewerTo = (highlight: IHighlight) => {};

const resetHash = () => {
  document.location.hash = "";
};

const PDF = () => {
  const [url, setUrl] = useState("");
  const [highlights, setHighlights] = useState([] as IHighlight[]);
  // const [statusText, setStatusText] = useState("");
  const [resumeId, setResumeId] = useState("");
  const [sidebarStatus, setSidebarStatus] = useState(SidebarStatus.CAN_UPLOAD);

  const parseIdFromHash = useMemo(() => {
    return () => document.location.hash.slice("#highlight-".length);
  }, [document.location.hash]);

  const resetHighlightsAndHash = () => {
    setHighlights([]);
    resetHash();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPdfUploaded = (file: any) => {
    if (file) {
      setUrl(URLwithStore.createObjectURL(file));
      resetHighlightsAndHash();
      setSidebarStatus(SidebarStatus.UPLOADED);
    } else {
      setSidebarStatus(SidebarStatus.CAN_UPLOAD);
    }
  };

  const scrollToHighlightFromHash = useCallback(() => {
    const highlight = getHighlightById(parseIdFromHash());
    console.log("highlight", highlight);
    if (highlight) {
      scrollViewerTo(highlight);
    }
  }, []);

  // const getResumeIfAny = useCallback(async () => {
  //   if (document.location.pathname !== "/") {
  //     const id = document.location.pathname.slice(1);
  //     setSidebarStatus(SidebarStatus.LOADING);

  //     try {
  //       const result = await get(databaseRef(database, `resumes/${id}`));
  //       if (result.exists()) {
  //         const resume = result.val();
  //         setUrl(resume.fileUrl);
  //         setResumeId(id);
  //         resume.comments = resume?.comments
  //           ? resume?.comments.map((comment: { position: { [x: string]: never[]; hasOwnProperty: (arg0: string) =>  }; }) => {
  //               if (!comment.position.hasOwnProperty("rects")) {
  //                 comment.position["rects"] = [];
  //                 return comment;
  //               } else return comment;
  //             })
  //           : [];

  //         setHighlights(resume.comments ?? []);
  //         setSidebarStatus(SidebarStatus.CAN_UPLOAD);
  //       } else {
  //         document.location.pathname = "/";
  //         setSidebarStatus(SidebarStatus.CAN_UPLOAD);
  //       }
  //     } catch (error) {
  //       console.error("error occurred", error);
  //       document.location.pathname = "/";
  //       setSidebarStatus(SidebarStatus.CAN_UPLOAD);
  //     }
  //   }
  // }, []);
  const getResumeIfAny = useCallback(async () => {
    if (document.location.pathname !== "/") {
      const id = document.location.pathname.slice(1);
      setSidebarStatus(SidebarStatus.LOADING);

      try {
        const storedItem = localStorage.getItem(`resumes/${id}`);
        if (storedItem) {
          const resume = JSON.parse(storedItem);
          if (resume) {
            setUrl(resume.fileUrl);
            setResumeId(id);
            setHighlights(resume.comments ?? []);
            setSidebarStatus(SidebarStatus.CAN_UPLOAD);
          } else {
            document.location.pathname = "/";
            setSidebarStatus(SidebarStatus.CAN_UPLOAD);
          }
        }
      } catch (error) {
        console.error("error occurred", error);
        document.location.pathname = "/";
        setSidebarStatus(SidebarStatus.CAN_UPLOAD);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", scrollToHighlightFromHash, false);
    return () => {
      window.removeEventListener("hashchange", scrollToHighlightFromHash);
    };
  }, [highlights, scrollToHighlightFromHash]);
  const synchronizeHighlights = async (newHighlights: NewHighlight[]) => {
    if (resumeId !== "") {
      const storedItem = localStorage.getItem(`resumes/${resumeId}`);
      if (storedItem) {
        const storedResume = JSON.parse(storedItem);

        if (storedResume) {
          try {
            if (newHighlights.length === 0) {
              localStorage.removeItem(`resumes/${resumeId}/comments`);
            } else {
              storedResume.comments = newHighlights;
              localStorage.setItem(
                `resumes/${resumeId}`,
                JSON.stringify(storedResume)
              );
            }
          } catch (error) {
            console.error("error occurred while syncing", error);
          }
        }
      }
    }
  };
  useEffect(() => {
    synchronizeHighlights(highlights);
  }, [highlights]);

  useEffect(() => {
    getResumeIfAny().then();
  }, [getResumeIfAny]);

  // const synchronizeHighlights = async (newHighlights: NewHighlight[]) => {
  //   if (resumeId !== "") {
  //     const updates = {
  //       [`/resumes/${resumeId}/comments`]: { ...newHighlights },
  //     };
  //     try {
  //       if (newHighlights.length == 0) {
  //         const databaseWriteResult = await remove(
  //           databaseRef(database, `/resumes/${resumeId}/comments`)
  //         );
  //       } else {
  //         const databaseWriteResult = await update(
  //           databaseRef(database),
  //           updates
  //         );
  //       }
  //     } catch {
  //       console.log("error occurred while syncing");
  //     }
  //   }
  // };

  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  const onDeleteHighlight = (highlight: IHighlight) => {
    setHighlights((prevState) => {
      return prevState.filter((h) => {
        return h.id !== highlight.id;
      });
    });
  };

  const addHighlight = (highlight: NewHighlight) => {
    setHighlights((prevState) => {
      const newHighlights = [
        { ...highlight, id: generateCommentId() },
        ...prevState,
      ];

      return newHighlights;
    });
  };

  const updateHighlight = (
    highlightId: string,
    position: { boundingRect: Scaled },
    content: { image: string }
  ) => {
    setHighlights((prevState) => {
      const newHighlights = prevState.map((h) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content: { ...originalContent, ...content },
              ...rest,
            }
          : h;
      });

      return newHighlights;
    });
  };

  return (
    <div className="App" style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        status={sidebarStatus}
        // statusText={statusText}
        highlights={highlights}
        onPdfUploaded={onPdfUploaded}
        onDeleteClicked={onDeleteHighlight}
      />
      <div style={{ height: "100vh", width: "75vw", position: "relative" }}>
        {url === "" ? (
          sidebarStatus === SidebarStatus.LOADING ? (
            <div
              style={{ height: "100vh", width: "75vw", position: "relative" }}
            >
              <p>Resume is being loaded...</p>
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
          <PdfLoader
            url={url}
            beforeLoad={
              <div
                style={{ height: "100vh", width: "75vw", position: "relative" }}
              >
                <p>Resume is being loaded...</p>
              </div>
            }
          >
            {(pdfDocument) => (
              <div
                style={{
                  pointerEvents: `${
                    sidebarStatus === SidebarStatus.SHARING_IN_PROGRESS
                      ? "none"
                      : "unset"
                  }`,
                }}
              >
                <PdfHighlighter
                  pdfDocument={pdfDocument}
                  enableAreaSelection={(event) => event.altKey}
                  onScrollChange={resetHash}
                  scrollRef={(scrollTo) => {
                    scrollViewerTo = scrollTo;
                    scrollToHighlightFromHash();
                  }}
                  onSelectionFinished={(
                    position,
                    content
                    // hideTipAndSelection,
                    // transformSelection
                  ) => (
                    // <Tip
                    //   onOpen={transformSelection}
                    //   onConfirm={(comment) => {
                    //     addHighlight({ content, position, comment });
                    //     hideTipAndSelection();
                    //   }}
                    // />
                    <button
                      onClick={() => {
                        localStorage.setItem(
                          "id",
                          JSON.stringify({ position, content })
                        );
                      }}
                    >
                      save
                    </button>
                  )}
                  highlightTransform={(
                    highlight,
                    index,
                    setTip,
                    hideTip,
                    viewportToScaled,
                    screenshot,
                    isScrolledTo
                  ) => {
                    const isTextHighlight = !(
                      highlight.content && highlight.content.image
                    );

                    const component = isTextHighlight ? (
                      <Highlight
                        isScrolledTo={isScrolledTo}
                        position={highlight.position}
                        comment={highlight.comment}
                      />
                    ) : (
                      <AreaHighlight
                        isScrolledTo={isScrolledTo}
                        highlight={highlight}
                        onChange={(boundingRect) => {
                          updateHighlight(
                            highlight.id,
                            { boundingRect: viewportToScaled(boundingRect) },
                            { image: screenshot(boundingRect) }
                          );
                        }}
                      />
                    );

                    return (
                      <Popup
                        popupContent={<HighlightPopup {...highlight} />}
                        onMouseOver={(popupContent) =>
                          setTip(highlight, () => popupContent)
                        }
                        onMouseOut={hideTip}
                        key={index}
                        children={component}
                      />
                    );
                  }}
                  highlights={highlights}
                />{" "}
              </div>
            )}
          </PdfLoader>
        )}
      </div>
    </div>
  );
};

export default PDF;
