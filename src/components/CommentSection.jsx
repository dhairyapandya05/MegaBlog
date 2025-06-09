import React, {useState, useEffect} from "react";
import Comment from "./Comments";
import useNode from "../hooks/useNode";
import {useSelector} from "react-redux";
import firebaseCommentService from "../appwrite/comments";

const CommentSection = (props) => {
  const [commentsData, setCommentsData] = useState(props.comment);

  const [commentCount, setCommentCount] = useState(0);

  const {insertNode, editNode, deleteNode, likeNode} = useNode();

  // useEffect to listen to commentsData.items changes
  useEffect(() => {
    console.log("Props.comment:", props.comment);
    const count = commentsData.items?.length || 0;
    setCommentCount(count);
    console.log("Comments Data: ", commentsData);

    // Optional: Log the change for debugging
    console.log(`Comments count updated: ${count}`);
  }, [commentsData.items]); // Dependency on commentsData.items

  const handleInsertNode = async (folderId, item, metaData) => {
    const finalStructure = insertNode(commentsData, folderId, item, metaData);
    // update the database about the new comment
    console.log("Slug: ", props.slug);
    console.log("Final Structure: ", finalStructure);
    let resp = await firebaseCommentService.createComment(
      props.slug,
      finalStructure
    );
    console.log("💯💯💯create Firebase Response: ", resp);
    setCommentsData(finalStructure);
  };

  const handleEditNode = async (folderId, value) => {
    const finalStructure = editNode(commentsData, folderId, value);
    let resp = await firebaseCommentService.updateComment(
      props.slug,
      finalStructure
    );
    console.log("💯💯💯update Firebase Response: ", resp);
    setCommentsData(finalStructure);
  };

  const handleDeleteNode = async (folderId) => {
    const finalStructure = deleteNode(commentsData, folderId);
    let resp = await firebaseCommentService.updateComment(
      props.slug,
      finalStructure
    );
    console.log("💯💯💯delete Firebase Response: ", resp);
    // A shallow copy might be needed to trigger re-render if the root object is not changed by deleteNode
    const temp = {...finalStructure};
    setCommentsData(temp);
  };

  const handleLikeNode = async (folderId) => {
    const finalStructure = likeNode(commentsData, folderId);
    let resp = await firebaseCommentService.updateComment(
      props.slug,
      finalStructure
    );
    console.log("like update Firebase Response: ", resp);
    setCommentsData(finalStructure);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {`Comments (${commentCount})`}
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
