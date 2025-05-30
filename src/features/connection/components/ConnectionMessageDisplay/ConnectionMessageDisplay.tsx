import React from "react";
import styles from "./ConnectionMessageDisplay.module.css";

interface ConnectionMessageDisplayProps {
  error?: string;
  success?: string;
  releaseMessage?: string;
}

const ConnectionMessageDisplay: React.FC<ConnectionMessageDisplayProps> = ({
  error,
  success,
  releaseMessage,
}) => {
  if (!error && !success && !releaseMessage) {
    return null;
  }

  return (
    <>
      {error && <strong className={styles["error-message"]}>{error}</strong>}
      {!error && success && (
        <p className={styles["success-message"]}>{success}</p>
      )}
      {!error && !success && releaseMessage && (
        <p className={styles["release-message"]}>{releaseMessage}</p>
      )}
    </>
  );
};

export default ConnectionMessageDisplay;
