import React, { useState } from "react";
import useNode from "../hooks/useNode";
import Comment from "./Comments";

const CommentSection = () => {
  const [commentsData, setCommentsData] = useState({
    id: 1,
    items: [],
    isLiked: false,
    likes: 0
  });

  const { insertNode, editNode, deleteNode, likeNode } = useNode();

  const handleInsertNode = (folderId, item) => {
    const finalStructure = insertNode(commentsData, folderId, item);
    setCommentsData(finalStructure);
  };

  const handleEditNode = (folderId, value) => {
    const finalStructure = editNode(commentsData, folderId, value);
    setCommentsData(finalStructure);
  };

  const handleDeleteNode = (folderId) => {
    const finalStructure = deleteNode(commentsData, folderId);
    // A shallow copy might be needed to trigger re-render if the root object is not changed by deleteNode
    const temp = { ...finalStructure };
    setCommentsData(temp);
  };

  const handleLikeNode = (folderId) => {
    const finalStructure = likeNode(commentsData, folderId);
    setCommentsData(finalStructure);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Comment Section
        </h1>
        <Comment
          handleInsertNode={handleInsertNode}
          handleEditNode={handleEditNode}
          handleDeleteNode={handleDeleteNode}
          handleLikeNode={handleLikeNode}
          comment={commentsData}
        />
      </div>
    </div>
  );
};

export default CommentSection; 