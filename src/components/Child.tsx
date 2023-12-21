import {
  AreaHighlight,
  Highlight,
  PdfHighlighter,
  Popup,
} from "react-pdf-highlighter";
import { HighlightPopup } from "./HighlightPopup";
import { SidebarStatus } from "../type/type";
import { generateCommentId } from "../utils/id-generator";
import { useContext } from "react";
import { HighlightContext } from "./context";

const Child = ({
  pdfDocument,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pdfDocument: any;
}) => {
  const { sidebarStatus, highlights, handleHighlightSelection } =
    useContext(HighlightContext);
  console.log(highlights, "jkljk;jkl");
  return (
    <div
      style={{
        pointerEvents: `${
          sidebarStatus === SidebarStatus.SHARING_IN_PROGRESS ? "none" : "unset"
        }`,
      }}
    >
      <PdfHighlighter
        pdfDocument={pdfDocument}
        enableAreaSelection={(event) => event.altKey}
        onScrollChange={() => {
          console.log("first");
        }}
        scrollRef={(scrollTo) => {
          // scrollViewerTo = scrollTo;
          // scrollToHighlightFromHash();
          console.log("first", scrollTo);
        }}
        onSelectionFinished={(position, content, _, transformSelection) => (
          <button
            onClick={() => {
              transformSelection();
              handleHighlightSelection(true);
              localStorage.setItem(
                "id",
                JSON.stringify({
                  id: generateCommentId(),
                  position,
                  content,
                })
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
              onChange={() => {
                console.log("first");
                //   updateHighlight(
                //     highlight.id,
                //     { boundingRect: viewportToScaled(boundingRect) },
                //     { image: screenshot(boundingRect) }
                //   );
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
  );
};

export default Child;
