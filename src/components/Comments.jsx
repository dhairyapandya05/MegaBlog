import {useEffect, useState, useRef} from "react";
import Action from "./Action";
import {Heart, MessageCircle, ChevronUp, ChevronDown} from "lucide-react";

const Comment = ({
  handleInsertNode,
  handleEditNode,
  handleDeleteNode,
  handleLikeNode,
  comment,
}) => {
  const [input, setInput] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [expand, setExpand] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [editMode]);

  const handleNewComment = () => {
    setShowInput(true);
    setExpand(true);
  };

  const handleToggleReplies = () => {
    setExpand(!expand);
  };

  const onAddComment = () => {
    if (editMode) {
      handleEditNode(comment.id, inputRef?.current?.innerText);
    } else {
      setExpand(true);
      handleInsertNode(comment.id, input);
      setShowInput(false);
      setInput("");
    }

    if (editMode) setEditMode(false);
  };

  const handleDelete = () => {
    handleDeleteNode(comment.id);
  };

  const handleLike = () => {
    handleLikeNode(comment.id);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={
          comment.id === 1
            ? "bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4"
            : "bg-white rounded-lg shadow-sm border border-gray-50 p-4 mb-3 hover:shadow-md transition-shadow duration-200"
        }
      >
        {comment.id === 1 ? (
          <div className="flex gap-3">
            <input
              type="text"
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-sm"
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share your thoughts..."
            />
            <Action
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors duration-200"
              type="COMMENT"
              handleClick={onAddComment}
            >
              Post
            </Action>
          </div>
        ) : (
          <div>
            <div className="mb-3">
              <span
                contentEditable={editMode}
                suppressContentEditableWarning={editMode}
                ref={inputRef}
                className={`text-gray-800 text-sm leading-relaxed ${
                  editMode
                    ? "bg-gray-50 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    : ""
                }`}
                style={{wordWrap: "break-word"}}
              >
                {comment.name}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {editMode ? (
                  <>
                    <Action
                      className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs"
                      type="SAVE"
                      handleClick={onAddComment}
                    />
                    <Action
                      className="px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-xs"
                      type="CANCEL"
                      handleClick={() => {
                        if (inputRef.current)
                          inputRef.current.innerText = comment.name;
                        setEditMode(false);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Action
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors duration-200 ${
                        comment.isLiked
                          ? "text-red-600 bg-red-50 hover:bg-red-100"
                          : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                      }`}
                      handleClick={handleLike}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          comment.isLiked ? "fill-current" : ""
                        }`}
                      />
                      {comment.likes > 0 && (
                        <span className="text-xs font-medium">
                          {comment.likes}
                        </span>
                      )}
                    </Action>

                    <Action
                      className="flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                      handleClick={handleNewComment}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Comment</span>
                    </Action>

                    {comment?.items?.length > 0 && (
                      <Action
                        className="flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors duration-200"
                        handleClick={handleToggleReplies}
                      >
                        {expand ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                        <span className="text-xs font-medium">
                          {expand ? "Hide" : "Show"} Replies (
                          {comment.items.length})
                        </span>
                      </Action>
                    )}
                  </>
                )}
              </div>

              {!editMode && (
                <div className="flex items-center gap-2">
                  <Action
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors duration-200"
                    type="EDIT"
                    handleClick={() => setEditMode(true)}
                  />
                  <Action
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                    type="DELETE"
                    handleClick={handleDelete}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div
        className={`${
          expand ? "block" : "hidden"
        } ml-6 border-l-2 border-gray-100 pl-4`}
      >
        {showInput && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
            <div className="flex gap-3">
              <input
                type="text"
                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-sm"
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Write a reply..."
              />
              <Action
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium transition-colors duration-200"
                handleClick={onAddComment}
              >
                Reply
              </Action>
              <Action
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-xs font-medium transition-colors duration-200"
                type="CANCEL"
                handleClick={() => {
                  setShowInput(false);
                  setInput("");
                  if (!comment?.items?.length) setExpand(false);
                }}
              />
            </div>
          </div>
        )}

        {comment?.items?.map((cmnt) => {
          return (
            <Comment
              key={cmnt.id}
              handleInsertNode={handleInsertNode}
              handleEditNode={handleEditNode}
              handleDeleteNode={handleDeleteNode}
              handleLikeNode={handleLikeNode}
              comment={cmnt}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Comment;
