// useNode.js - Hook for managing comment tree operations

const useNode = () => {
  const insertNode = function (tree, commentId, item) {
    if (tree.id === commentId) {
      return {
        ...tree,
        items: [
          ...tree.items,
          {
            id: new Date().getTime(),
            name: item,
            likes: 0,
            dislikes: 0,
            isLiked: false,
            items: [],
          },
        ],
      };
    }

    const latestNode = tree.items.map((ob) => {
      return insertNode(ob, commentId, item);
    });

    return {...tree, items: latestNode};
  };

  const editNode = (tree, commentId, value) => {
    if (tree.id === commentId) {
      return {
        ...tree,
        name: value,
      };
    }

    const latestNode = tree.items.map((ob) => {
      return editNode(ob, commentId, value);
    });

    return {...tree, items: latestNode};
  };

  const deleteNode = (tree, id) => {
    const filteredItems = tree.items.filter((item) => item.id !== id);

    if (filteredItems.length !== tree.items.length) {
      return {...tree, items: filteredItems};
    }

    const latestNode = tree.items.map((ob) => {
      return deleteNode(ob, id);
    });

    return {...tree, items: latestNode};
  };

  const likeNode = (tree, commentId) => {
    if (tree.id === commentId) {
      const newIsLiked = !tree.isLiked;
      const newLikes = newIsLiked
        ? (tree.likes || 0) + 1
        : Math.max((tree.likes || 0) - 1, 0);
      return {
        ...tree,
        isLiked: newIsLiked,
        likes: newLikes,
      };
    }

    const latestNode = tree.items.map((ob) => {
      return likeNode(ob, commentId);
    });

    return {...tree, items: latestNode};
  };

  return {insertNode, editNode, deleteNode, likeNode};
};

export default useNode;
