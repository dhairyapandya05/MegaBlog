import React, {useEffect, useState} from "react";
import firebaseService from "../appwrite/config";
import {Container, PostCard} from "../components";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    firebaseService.getPosts().then((posts) => {
      if (posts) {
        setPosts(posts);
      }
    });
  }, []);

  if (posts?.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500">
                Login to read posts
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }
  return (
    <div className="w-full py-8 ">
      <Container>
        <div className=" columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-0">
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

export default Home;
