// useNode.js - Hook for managing comment tree operations

const useNode = () => {
  const insertNode = function (tree, commentId, item) {
    if (tree.id === commentId) {
      tree.items.push({
        id: new Date().getTime(),
        name: item,
        likes: 0,
        dislikes: 0,
        isLiked: false,
        items: [],
      });
      return tree;
    }

    let latestNode = [];
    latestNode = tree.items.map((ob) => {
      return insertNode(ob, commentId, item);
    });

    return {...tree, items: latestNode};
  };

  const editNode = (tree, commentId, value) => {
    if (tree.id === commentId) {
      tree.name = value;
      return tree;
    }

    tree.items.map((ob) => {
      return editNode(ob, commentId, value);
    });

    return {...tree};
  };

  const deleteNode = (tree, id) => {
    for (let i = 0; i < tree.items.length; i++) {
      const currentItem = tree.items[i];
      if (currentItem.id === id) {
        tree.items.splice(i, 1);
        return tree;
      } else {
        deleteNode(currentItem, id);
      }
    }
    return tree;
  };

  const likeNode = (tree, commentId) => {
    if (tree.id === commentId) {
      tree.isLiked = !tree.isLiked;
      if (tree.isLiked) {
        tree.likes = (tree.likes || 0) + 1;
      } else {
        tree.likes = Math.max((tree.likes || 0) - 1, 0);
      }
      return tree;
    }

    tree.items.map((ob) => {
      return likeNode(ob, commentId);
    });

    return {...tree};
  };

  return {insertNode, editNode, deleteNode, likeNode};
};

export default useNode;
