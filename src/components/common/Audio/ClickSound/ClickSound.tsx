"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Howl } from "howler";
import styles from "./ClickSound.module.css";

// クリックサウンドのオプションタイプ定義
interface ClickSoundOptions {
  soundPath?: string;
  volume?: number;
  delay?: number; // 遅延時間（ミリ秒）
}

// クリックサウンドを再生するカスタムフック (Howler.js使用)
export const useClickSound = (options: ClickSoundOptions = {}) => {
  const [sound, setSound] = useState<Howl | null>(null);

  // デフォルト値の設定
  const {
    soundPath = "/audio/click-sound_decision.mp3",
    volume = 1,
    delay = 0, // デフォルトは遅延なし
  } = options;

  // コンポーネントマウント時に音声ファイルをロード
  useEffect(() => {
    const howlSound = new Howl({
      src: [soundPath],
      preload: true,
      volume: volume,
      html5: true,
    });

    setSound(howlSound);

    return () => {
      howlSound.stop();
      howlSound.unload();
    };
  }, [soundPath, volume]);

  // クリックサウンドを再生する関数
  const playClickSound = useCallback(
    (callback?: () => void) => {
      if (sound) {
        // 既に再生中の場合は停止してから再生
        if (sound.playing()) {
          sound.stop();
        }
        sound.play();

        // 遅延後にコールバックを実行
        if (callback && delay > 0) {
          setTimeout(callback, delay);
        } else if (callback) {
          // 遅延なしの場合は直接実行
          callback();
        }
      }
    },
    [sound, delay]
  );

  return { playClickSound };
};

// クリックサウンドを適用できるボタンコンポーネント
const ClickSound: React.FC<{
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  soundPath?: string;
  volume?: number;
  delay?: number; // 遅延時間を追加
}> = ({ onClick, className, children, soundPath, volume, delay }) => {
  const { playClickSound } = useClickSound({ soundPath, volume, delay });

  // 元のonClickとクリックサウンドを組み合わせる
  const handleClick = () => {
    playClickSound(onClick);
  };

  return (
    <button
      className={`${styles.clickButton} ${className || ""}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default ClickSound;
