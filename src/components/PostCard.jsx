import React from "react";
import appwriteService from "../appwrite/config";
import {Link} from "react-router-dom";
import parse from "html-react-parser";

function PostCard({id, title, content, featuredImage}) {
  return (
    <Link to={`/post/${id}`}>
      <div className="overflow-hidden  w-full bg-white rounded-xl p-4 shadow-md">
        <div className="w-full justify-center mb-4">
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className="rounded-xl"
          />
        </div>
        <h2 className="text-xl font-bold truncate block w-full">{title}</h2>
        <div className="relative">
          <p className=" line-clamp-3 text-gray-700">{parse(content)}</p>
          <p
            className="absolute right-0 bottom-0 text-purple-700 font-semibold px-2"
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,0.5) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,1) 100%)",
            }}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;Read more...
          </p>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
