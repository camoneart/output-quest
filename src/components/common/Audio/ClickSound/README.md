# クリックサウンドコンポーネント (Howler.js)

このコンポーネントはボタンクリック時に音声効果を再生する機能を提供します。Howler.js を使用して、高品質かつクロスブラウザ対応のオーディオ再生を実現しています。

## 特徴

- Howler.js を使用したボタンクリック時の音声再生
- カスタムフックとして再利用可能
- 既存のボタンやコンポーネントに簡単に統合可能
- クロスブラウザ対応のオーディオ再生
- **カスタム音声ファイルの指定が可能**

## 使用方法

### 方法 1: ClickSound コンポーネントを直接使用

```tsx
import ClickSound from "components/common/Audio/ClickSound/ClickSound";

const MyComponent = () => {
  return (
    <ClickSound
      onClick={() => console.log("クリックされました")}
      soundPath="/audio/custom-sound.mp3" // カスタム音声ファイルを指定（オプション）
    >
      クリックしてみてください
    </ClickSound>
  );
};
```

### 方法 2: useClickSound フックを使用

```tsx
import { useClickSound } from "components/common/Audio/ClickSound/ClickSound";

const MyCustomButton = () => {
  // カスタム音声ファイルのパスを指定できます（オプション）
  const { playClickSound } = useClickSound("/audio/custom-sound.mp3");

  const handleClick = () => {
    playClickSound(); // クリック音を再生
    // 他の処理...
  };

  return <button onClick={handleClick}>カスタムボタン</button>;
};
```

### 方法 3: Howler.js を直接使用

```tsx
import { Howl } from "howler";

const MyComponent = () => {
  const handleClick = () => {
    const sound = new Howl({
      src: ["/audio/custom-sound.mp3"],
      volume: 1.0,
    });
    sound.play();
  };

  return <button onClick={handleClick}>ボタン</button>;
};
```

## プロパティ

### ClickSound コンポーネント

| プロパティ | 型         | 説明                                                             |
| ---------- | ---------- | ---------------------------------------------------------------- |
| onClick    | () => void | クリック時に実行する関数（オプション）                           |
| className  | string     | 追加の CSS クラス（オプション）                                  |
| children   | ReactNode  | ボタン内に表示する内容                                           |
| soundPath  | string     | 音声ファイルのパス（オプション、デフォルト: "/audio/click.mp3"） |

### useClickSound フック

| パラメータ | 型     | 説明                                                             |
| ---------- | ------ | ---------------------------------------------------------------- |
| soundPath  | string | 音声ファイルのパス（オプション、デフォルト: "/audio/click.mp3"） |

| 返り値         | 型         | 説明                     |
| -------------- | ---------- | ------------------------ |
| playClickSound | () => void | クリック音を再生する関数 |

## Howler.js の主な機能

- クロスブラウザのオーディオ再生
- 自動的なオーディオフォーマット検出と対応
- 複数のオーディオインスタンスの同時再生
- 空間的なオーディオサポート
- 複数のオーディオスプライト対応

## 使用例

詳細な使用例は `ClickSoundExample.tsx` を参照してください。サンプルには以下が含まれています：

1. ClickSound コンポーネントの使用例
2. useClickSound フックの使用例
3. Howler.js の直接使用例
