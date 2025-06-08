import React from "react";
import { Metadata } from "next";
import { getPageMetadata } from "@/config/metadata";
import styles from "./PostsPage.module.css";
import * as Posts from "@/features/posts/components/index";

export const metadata: Metadata = getPageMetadata("posts");

const PostsPage = () => {
  return (
    <>
      <h1 className={`${styles["posts-title"]}`}>投稿一覧</h1>
      <div className={`${styles["posts-content-container"]}`}>
        <Posts.ZennPosts />
      </div>
    </>
  );
};

export default PostsPage;
