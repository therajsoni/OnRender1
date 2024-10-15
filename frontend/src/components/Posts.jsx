import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const { posts } = useSelector((store) => store.post);

  return (
    <div className="flex flex-col items-center">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post key={post._id} post={post} />
        ))
      ) : (
        <div className="text-center mt-4">
          <p>No posts available. Please check back later!</p>
        </div>
      )}
    </div>
  );
};

export default Posts;
