import "../style/Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { SidebarStatus } from "../type/type";
import CommentList from "./CommentList";
import { HighlightContext } from "./context";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPdfUploaded: (changeEvent: any) => void;
}

const Sidebar = ({ onPdfUploaded }: Props) => {
  const [inp, setInp] = useState("");
  const {
    sidebarStatus,
    handleHighlightSelection,
    addHighlights,
  } = useContext(HighlightContext);

  useEffect(() => {
    const a = JSON.parse(localStorage.getItem("id") as string);
    console.log(a);
    setInp(`${a?.content?.text}   @`);
    handleHighlightSelection(false);
  }, [handleHighlightSelection]);

  const handleRaiseClick = () => {
    const newer = JSON.parse(localStorage.getItem("id") as string);
    const extraNewer = {
      ...newer,
      comment: {
        emoji: "",
        text: inp.substring(inp.indexOf("@")),
      },
    };
    addHighlights(extraNewer);
  };
  const BrowseAndShare = () => {
    return (
      <div className="sidebar__browse-and-share">
        {(sidebarStatus === SidebarStatus.CAN_UPLOAD ||
          sidebarStatus === SidebarStatus.UPLOADED) && (
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const files = e.target.files;
              files && onPdfUploaded(files[0]);
            }}
          />
        )}
        {sidebarStatus === SidebarStatus.SHARING_IN_PROGRESS && <p>ss</p>}
      </div>
    );
  };

  return (
    <div className="sidebar">
      <div>hello</div>
      <BrowseAndShare />
      <CommentList />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRaiseClick();
        }}
      >
        <textarea value={inp} onChange={(e) => setInp(e.target.value)} />
        <button type="submit">raise</button>
      </form>
    </div>
  );
};

export { Sidebar };
