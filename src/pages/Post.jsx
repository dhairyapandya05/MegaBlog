import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import appwriteService from "../appwrite/config";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Eye,
  Calendar,
  User,
  Edit,
  Trash2,
} from "lucide-react";
import {Button, Container} from "../components";
import parse from "html-react-parser";
import {useSelector} from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  const {slug} = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.id : false;

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) {
          setPost(post);
          // Initialize counts (you'll need to implement these in your backend)
          setLikesCount(post.likesCount || 42);
          setCommentsCount(post.commentsCount || 8);
          setViewsCount(post.viewsCount || 156);

          // Check if user has liked/bookmarked (implement in backend)
          // setIsLiked(checkIfUserLiked(post.id, userData?.id));
          // setIsBookmarked(checkIfUserBookmarked(post.id, userData?.id));
        } else {
          navigate("/");
        }
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  const deletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      appwriteService.deletePost(post.id).then((status) => {
        if (status) {
          appwriteService.deleteFile(post.featuredImage);
          navigate("/");
        }
      });
    }
  };

  const handleLike = () => {
    if (!userData) {
      // Redirect to login or show login modal
      navigate("/login");
      return;
    }

    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    // Implement backend call to update likes
    // appwriteService.toggleLike(post.id, userData.id);
  };

  const handleBookmark = () => {
    if (!userData) {
      navigate("/login");
      return;
    }

    setIsBookmarked(!isBookmarked);

    // Implement backend call to update bookmarks
    // appwriteService.toggleBookmark(post.id, userData.id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
      alert("Link copied to clipboard!");
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!userData) {
      navigate("/login");
      return;
    }

    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        content: newComment,
        author: userData.name || "Anonymous",
        avatar: userData.avatar || "/default-avatar.png",
        createdAt: new Date().toISOString(),
      };

      setComments((prev) => [comment, ...prev]);
      setCommentsCount((prev) => prev + 1);
      setNewComment("");

      // Implement backend call to save comment
      // appwriteService.addComment(post.id, comment);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Hero Image */}
          <div className="relative">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-2xl"
            />

            {/* Author Actions */}
            {isAuthor && (
              <div className="absolute top-4 right-4 flex gap-2">
                <Link to={`/edit-post/${post.id}`}>
                  <button className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105">
                    <Edit size={18} />
                  </button>
                </Link>
                <button
                  onClick={deletePost}
                  className="bg-white/90 backdrop-blur-sm hover:bg-red-50 text-red-600 p-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl mt-8 overflow-hidden">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-gray-100">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Meta Information */}
              {/* <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <User size={16} />
                  <span>By {post.author || "Anonymous"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{formatDate(post.createdAt || new Date())}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  <span>{viewsCount} views</span>
                </div>
              </div> */}

              {/* Engagement Bar */}
              <div className="flex items-center justify-between py-4 border-t border-b border-gray-100">
                <div className="flex items-center gap-6">
                  {/* Like Button */}
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                      isLiked
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                    <span className="font-medium">{likesCount}</span>
                  </button>

                  {/* Comment Button */}
                  <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all duration-200"
                  >
                    <MessageCircle size={18} />
                    <span className="font-medium">{commentsCount}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Bookmark Button */}
                  <button
                    onClick={handleBookmark}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      isBookmarked
                        ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Bookmark
                      size={18}
                      fill={isBookmarked ? "currentColor" : "none"}
                    />
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all duration-200"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-6 md:p-8">
              <div className="prose prose-lg max-w-none text-gray-800">
                {parse(post.content)}
              </div>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="border-t border-gray-100 p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Comments ({commentsCount})
                </h3>

                {/* Comment Form */}
                {userData ? (
                  <form onSubmit={handleCommentSubmit} className="mb-8">
                    <div className="flex gap-4">
                      <img
                        src={userData.avatar || "/default-avatar.png"}
                        alt={userData.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write a comment..."
                          className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows="3"
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Post Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg mb-8">
                    <p className="text-gray-600 mb-4">
                      Please log in to leave a comment
                    </p>
                    <Link
                      to="/login"
                      className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Log In
                    </Link>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">
                              {comment.author}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {comments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle
                        size={48}
                        className="mx-auto mb-4 opacity-50"
                      />
                      <p>
                        No comments yet. Be the first to share your thoughts!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
