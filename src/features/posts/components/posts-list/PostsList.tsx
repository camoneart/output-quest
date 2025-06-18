import React from "react";
import * as Posts from "@/features/posts/components/index";
import styles from "./PostsList.module.css";
import { PostData } from "@/features/posts/types";

type PostsListProps = {
  postsData: PostData[];
};

const PostsList = ({ postsData }: PostsListProps) => {
  return (
    <ul className={`${styles["posts-list"]}`}>
      {postsData.map((post) => (
        <li className={`${styles["posts-item"]}`} key={post.id}>
          <Posts.PostCard
            title={post.title}
            url={post.url}
            category={post.category}
            publishedAt={post.publishedAt}
            platformType={post.platformType}
          />
        </li>
      ))}
    </ul>
  );
};

export default PostsList;
