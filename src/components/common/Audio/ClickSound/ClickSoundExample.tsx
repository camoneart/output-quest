"use client";

import React from "react";
import ClickSound, { useClickSound } from "./ClickSound";

// 例1: ClickSoundコンポーネントをそのまま使用する例
export const ClickSoundButtonExample: React.FC = () => {
  return (
    <div>
      <h3>クリックサウンド付きボタンの例 (Howler.js使用)</h3>
      <ClickSound onClick={() => console.log("ボタンがクリックされました")}>
        クリックしてみてください
      </ClickSound>
    </div>
  );
};

// 例2: useClickSoundフックを他のコンポーネントで使用する例
export const CustomButtonWithSound: React.FC = () => {
  const { playClickSound } = useClickSound();

  const handleButtonClick = () => {
    playClickSound();
    console.log("カスタムボタンがクリックされました");
  };

  return (
    <div>
      <h3>カスタムボタンにクリックサウンドを追加した例 (Howler.js使用)</h3>
      <button
        onClick={handleButtonClick}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        カスタムスタイルボタン
      </button>
    </div>
  );
};

// Howler.jsの直接使用例
export const DirectHowlerExample: React.FC = () => {
  const handleClick = () => {
    // Howler.jsを直接使用する例（参考用）
    import("howler").then(({ Howl }) => {
      const clickSound = new Howl({
        src: ["/audio/click-sound_decision.mp3"],
        volume: 0.8,
      });
      clickSound.play();
    });
  };

  return (
    <div>
      <h3>Howler.jsを直接使用した例</h3>
      <button
        onClick={handleClick}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Howler直接使用
      </button>
    </div>
  );
};

// カスタム音声ファイルを使用する例
export const CustomSoundExample: React.FC = () => {
  // カスタム音声ファイルパスを指定
  const { playClickSound } = useClickSound({
    soundPath: "/audio/BitCastle.mp3",
  });

  return (
    <div>
      <h3>カスタム音声ファイルを使用する例</h3>
      <button
        onClick={() => playClickSound()}
        style={{
          padding: "10px 20px",
          backgroundColor: "#9C27B0",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        別の音声でクリック
      </button>
    </div>
  );
};

// 全ての例を含むコンポーネント
const ClickSoundExample: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>クリックサウンドの使用例 (Howler.js)</h2>
      <ClickSoundButtonExample />
      <div style={{ marginTop: "20px" }} />
      <CustomButtonWithSound />
      <div style={{ marginTop: "20px" }} />
      <DirectHowlerExample />
      <div style={{ marginTop: "20px" }} />
      <CustomSoundExample />
    </div>
  );
};

export default ClickSoundExample;
