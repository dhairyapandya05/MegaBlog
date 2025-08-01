import React, {useState, useEffect} from "react";
import {Container, PostCard} from "../components";
import appwriteService from "../appwrite/config";

function AllPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    appwriteService.getPosts().then((posts) => {
      console.log("Posts fetched:", posts);
      if (posts) {
        setPosts(posts);
      }
    });
  }, []);

  return (
    <div className="w-full py-8">
      <Container>
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-0">
          {posts?.map((post) => (
            <div
              key={post.id}
              className="break-inside-avoid mb-4 inline-block w-full"
            >
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;
