"use client";

import { useState, useEffect } from "react";
import styles from "./AboutTypingAnimation.module.css";

interface AboutTypingAnimationProps {
  text: string;
  speed?: number;
  className?: string;
  delay?: number;
}

const AboutTypingAnimation = ({
  text,
  speed = 290,
  className = "",
  delay = 2,
}: AboutTypingAnimationProps) => {
  const [typedText, setTypedText] = useState("");
  const [showTyping, setShowTyping] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // アニメーション開始の遅延設定
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTyping(true);
    }, delay * 1000);

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

  // アクティブ状態への切り替え
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(true);
    }, delay * 1000 + 2000); // 遅延 + 追加時間

    return () => clearTimeout(timer);
  }, [delay]);

  // テキスト内の「~」をspanタグで囲む関数
  const wrapTildeWithSpan = (inputText: string) => {
    return inputText
      .split("")
      .map((char, index) =>
        char === "~" ? <span key={index}>{char}</span> : char
      );
  };

  return (
    <h2
      className={`${className} ${styles.subtitle} ${
        isActive ? styles["active-subtitle"] : ""
      }`}
      style={{
        visibility: showTyping ? "visible" : "hidden",
        minHeight: "32px",
      }}
    >
      <span className={styles["subtitle-text"]}>
        {showTyping ? wrapTildeWithSpan(typedText) : wrapTildeWithSpan(text)}
      </span>
      {showTyping && <span className="animate-pulse">|</span>}
    </h2>
  );
};

export default AboutTypingAnimation;
