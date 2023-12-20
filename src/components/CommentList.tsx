import { useContext } from "react";
import { SidebarStatus } from "../type/type";
import { CommentListSkeleton } from "./CommentListSkeleton";
import CommentCard from "./CommentCard";
import { HighlightContext } from "./context";

const CommentList = () => {
  const {
    sidebarStatus,
    deleteHighlight,
    highlights,
  } = useContext(HighlightContext);

  return (
    <div>
      {sidebarStatus === SidebarStatus.LOADING ? (
        <CommentListSkeleton />
      ) : (
        <ul className="sidebar__comment-list">
          {highlights?.map((highlight, index) => (
            <li key={index} className="sidebar__comment">
              <CommentCard
                text={highlight.comment.text}
                selectedText={highlight.content.text}
                onClick={() => console.log("llllllll")}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onDelete={(e: any) => {
                  if (e && e.stopPropagation) e.stopPropagation();
                  deleteHighlight(highlight);
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default CommentList;
