import React from "react";
import { Heart, MessageCircle, Edit3, Trash2, ChevronUp, ChevronDown, Save, X } from "lucide-react";

// Action component for buttons
const Action = ({ className, type, handleClick, children }) => {
  const getIcon = () => {
    switch (type) {
      case "LIKE":
        return <Heart className="w-3 h-3" />;
      case "REPLY":
        return <MessageCircle className="w-3 h-3" />;
      case "EDIT":
        return <Edit3 className="w-3 h-3" />;
      case "DELETE":
        return <Trash2 className="w-3 h-3" />;
      case "SAVE":
        return <Save className="w-3 h-3" />;
      case "CANCEL":
        return <X className="w-3 h-3" />;
      case "COMMENT": // Added for the main comment button
        return null;
      default:
        return null;
    }
  };

  return (
    <button
      className={`${className} flex items-center gap-1 transition-all duration-200`}
      onClick={handleClick}
    >
      {children || getIcon()}
      {typeof type === "string" && type !== "LIKE" && type !== "COMMENT" && (
        <span className="text-xs font-medium">{type}</span>
      )}
    </button>
  );
};

export default Action; 