import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import firebaseService from "../appwrite/config";
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
import CommentSection from "../components/CommentSection";

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
  const commentRef = useRef(null);

  useEffect(() => {
    if (showComments && commentRef.current) {
      commentRef.current.scrollIntoView({behavior: "smooth"});
    }
  }, [showComments]);

  useEffect(() => {
    if (slug) {
      firebaseService.getPost(slug).then((post) => {
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
      firebaseService.deletePost(post.id).then((status) => {
        if (status) {
          firebaseService.deleteFile(post.featuredImage);
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
    // firebaseService.toggleLike(post.id, userData.id);
  };

  const handleBookmark = () => {
    if (!userData) {
      navigate("/login");
      return;
    }

    setIsBookmarked(!isBookmarked);

    // Implement backend call to update bookmarks
    // firebaseService.toggleBookmark(post.id, userData.id);
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
      // firebaseService.addComment(post.id, comment);
    }
  };

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

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b  mb-8">
      <Container>
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8 relative">
          {/* Hero Image */}
          <div className="relative mt-6 ">
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
                  className="bg-red-500/90 backdrop-blur-sm hover:bg-red-600 text-white p-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
            <img
              src={firebaseService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-xl w-full max-h-[400px] object-cover shadow-md"
            />
          </div>
          {/* Post Details */}
          <div className="flex items-center justify-between text-gray-600 text-sm mt-4 mb-6">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{post.author || "Anonymous"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={16} />
                <span>{post?.viewCount || 0} views</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>

          {/* Post Title */}
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center leading-tight">
            {post.title}
          </h1>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none text-gray-800 mx-auto bg-white/80 p-4 rounded-xl">
            {parse(post.content)}
          </div>
          {/* Engagement Bar */}
          <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 mt-8">
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

              {/* Comment Button (will scroll to comments) */}
              <button
                onClick={() => setShowComments((prev) => !prev)}
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

          {/* Comments Section */}
          {showComments && (
            <div className="mt-8 ">
              <CommentSection />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
