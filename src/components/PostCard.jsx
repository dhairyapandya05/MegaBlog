import React, {useEffect} from "react";
import appwriteService from "../appwrite/config";
import {Link} from "react-router-dom";
import parse from "html-react-parser";

function PostCard({
  id,
  title,
  content,
  featuredImage,
  estimatedtime,
  createdAt,
  previewText,
}) {
  // Format the creation date
  const formatDate = (dateInput) => {
    try {
      let date;

      // Check if it's a Firestore timestamp object
      if (dateInput && typeof dateInput === "object" && dateInput.seconds) {
        // Convert Firestore timestamp to JavaScript Date
        // Firestore timestamp has seconds and nanoseconds
        date = new Date(
          dateInput.seconds * 1000 + dateInput.nanoseconds / 1000000
        );
      }
      // Check if it's a string in the format "June 8, 2025 at 5:55:46 PM UTC+5:30"
      else if (typeof dateInput === "string" && dateInput.includes(" at ")) {
        const datePart = dateInput.split(" at ")[0];
        date = new Date(datePart);
      }
      // Handle other string formats or Date objects
      else {
        date = new Date(dateInput);
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateInput);
        return "Invalid Date";
      }

      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      return date.toLocaleDateString("en-US", options);
    } catch (error) {
      console.warn("Date parsing error:", error);
      return "Invalid Date";
    }
  };

  return (
    <Link to={`/post/${id}`}>
      <div className="overflow-hidden w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group">
        {/* Image Container with Overlay Info */}
        <div className="relative w-full mb-4">
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className="w-full h-48 object-cover rounded-t-xl"
          />

          {/* Estimated Time Badge */}
          {/* <div className="absolute top-3 right-3">
            <span className="bg-black bg-opacity-70 text-white text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm">
              <svg
                className="inline-block w-3 h-3 mr-1.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              {estimatedtime} min read
            </span>
          </div> */}

          {/* Date Badge */}
          {/* <div className="absolute bottom-3 left-3">
            <span className="bg-white bg-opacity-90 text-gray-800 text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm">
              <svg
                className="inline-block w-3 h-3 mr-1.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              {formatDate(createdAt)}
            </span>
          </div> */}
        </div>

        {/* Content Container */}
        <div className="px-4 pb-4">
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {title}
          </h2>

          {/* Meta Information Row */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3 border-b border-gray-100 pb-2">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                {formatDate(createdAt)}
              </span>
              <span className="flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                {estimatedtime} min read
              </span>
            </div>
          </div>

          {/* Content Preview */}
          <div className="relative">
            <p className="line-clamp-3 text-gray-700 leading-relaxed">
              {previewText ? previewText : parse(content)}
            </p>
            <p
              className="absolute right-0 bottom-0 text-purple-600 font-semibold px-2 hover:text-purple-700 transition-colors duration-200"
              style={{
                background:
                  "linear-gradient(to right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,1) 100%)",
              }}
            >
              &nbsp;&nbsp;&nbsp;&nbsp;Read more...
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
