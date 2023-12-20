// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CommentCard = (props: any) => {
  const { text, onDelete, onClick, selectedText } = props;

  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "4px",
        borderWidth: "1px",
        width: "100%",
        height: "100%",
        textAlign: "left",
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <span style={{ cursor: "pointer" }} onClick={onDelete}>
            ⊗
          </span>
        </div>
        <div>{selectedText}</div>
        <p style={{ fontWeight: "normal", fontSize: "16px" }}>{text}</p>
      </div>
    </div>
  );
};

export default CommentCard;
