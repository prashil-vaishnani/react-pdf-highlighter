import { createContext, useState } from "react";
import { IHighlight, NewHighlight } from "react-pdf-highlighter";
import { SidebarStatus } from "../type/type";
import { generateCommentId } from "../utils/id-generator";

interface highlightContextType {
  highlights: IHighlight[];
  sidebarStatus: SidebarStatus;
  isHighlightSelected: boolean;
  addHighlights: (highlight: NewHighlight) => void;
  deleteHighlight: (highlight: IHighlight) => void;
  handleHighlightSelection: (toggle: boolean) => void;
  handleSidebarStatus: (status: SidebarStatus) => void;
}
export const HighlightContext = createContext<highlightContextType>(
  {} as highlightContextType
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HighlightContextProvider = (props: any) => {
  const [highlights, setHighlights] = useState(
    JSON.parse(localStorage.getItem("list") as string) as IHighlight[]
  );
  const [isHighlightSelected, setIsHighlightSelected] = useState(false);
  const [sidebarStatus, setSidebarStatus] = useState<SidebarStatus>(
    SidebarStatus.CAN_UPLOAD
  );

  const handleSidebarStatus = (status: SidebarStatus) => {
    setSidebarStatus(status);
  };

  const handleHighlightSelection = (toggle: boolean) => {
    setIsHighlightSelected(toggle);
  };

  const addHighlights = (highlight: NewHighlight) => {
    setHighlights((prevState) => {
      const newHighlights = [
        { ...highlight, id: generateCommentId() },
        ...prevState,
      ];

      return newHighlights;
    });
    localStorage.setItem("list", JSON.stringify(highlights));
  };

  const deleteHighlight = (highlight: IHighlight) => {
    setHighlights((prevState) => {
      return prevState.filter((h) => {
        return h.id !== highlight.id;
      });
    });
    localStorage.setItem("list", JSON.stringify(highlights));
  };
  const value = {
    highlights,
    isHighlightSelected,
    sidebarStatus,
    addHighlights,
    deleteHighlight,
    handleHighlightSelection,
    handleSidebarStatus,
  };
  return (
    <HighlightContext.Provider value={value}>
      {props.children}
    </HighlightContext.Provider>
  );
};

export default HighlightContextProvider;
