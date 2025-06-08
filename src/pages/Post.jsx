import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import appwriteService from "../appwrite/config";
import {Button, Container} from "../components";
import parse from "html-react-parser";
import {useSelector} from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const {slug} = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.id : false;

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) setPost(post);
        else navigate("/");
      });
    } else navigate("/");
  }, [slug, navigate]);

  const deletePost = () => {
    appwriteService.deletePost(post.id).then((status) => {
      if (status) {
        appwriteService.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  return post ? (
    <div className="py-10 bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen">
      <Container>
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8 relative">
          <div className="flex flex-col items-center mb-8">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-2xl w-full max-h-[400px] object-cover shadow-md border mb-6"
            />
            {isAuthor && (
              <div className="absolute right-8 top-8 flex gap-2">
                <Link to={`/edit-post/${post.id}`}>
                  <Button bgColor="bg-green-500" className="mr-2 shadow">
                    Edit
                  </Button>
                </Link>
                <Button
                  bgColor="bg-red-500"
                  onClick={deletePost}
                  className="shadow"
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
          <div className="mb-6 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 break-words leading-tight">
              {post.title}
            </h1>
            {/* Optionally show author and date if available */}
            {/* <p className="text-sm text-gray-500">By {post.author} • {formatDate(post.date)}</p> */}
          </div>
          <div className="prose prose-lg max-w-none text-gray-800 mx-auto bg-white/80 p-4 rounded-xl">
            {parse(post.content)}
          </div>
        </div>
      </Container>
    </div>
  ) : null;
}
