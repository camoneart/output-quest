"use client";

import { useState, useEffect } from "react";
import styles from "./HomeTypingAnimation.module.css";

interface HomeTypingAnimationProps {
  text: string;
  speed?: number;
  className?: string;
  delay?: number; // アニメーション開始の遅延時間（秒）
  titleAnimationDuration?: number; // HomeAnimatedTitleのアニメーション時間
}

const HomeTypingAnimation = ({
  text,
  speed = 290,
  className = "",
  delay = 6.5, // HomeAnimatedTitleのdelay + duration + 0.3秒
}: HomeTypingAnimationProps) => {
  const [typedText, setTypedText] = useState("");
  const [showTyping, setShowTyping] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // タイトルアニメーション後に表示を開始
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTyping(true);
    }, delay * 1000); // 秒からミリ秒に変換

    return () => clearTimeout(timer);
  }, [delay]);

  // タイピングアニメーション
  useEffect(() => {
    if (!showTyping) return;
    if (typedText === text) return;

    const timeout = setTimeout(() => {
      setTypedText(text.slice(0, typedText.length + 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [typedText, text, speed, showTyping]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 8600);
    return () => clearTimeout(timer);
  }, []);

  // テキスト内の「~」をspanタグで囲む関数
  const wrapTildeWithSpan = (inputText: string) => {
    // 「~」を正規表現で探し、spanタグで囲む
    return inputText
      .split("")
      .map((char, index) =>
        char === "~" ? <span key={index}>{char}</span> : char
      );
  };

  // nullを返さないようにし、要素自体は常に存在させる
  return (
    <h2
      className={`${className} ${styles["subtitle"]} ${
        isActive ? `${styles["active-subtitle"]}` : ""
      }`}
      style={{
        visibility: showTyping ? "visible" : "hidden",
        minHeight: "32px",
      }}
    >
      <span className={`${styles["subtitle-text"]}`}>
        {showTyping ? wrapTildeWithSpan(typedText) : wrapTildeWithSpan(text)}
      </span>
      {showTyping && <span className="animate-pulse">|</span>}
    </h2>
  );
};

export default HomeTypingAnimation;
