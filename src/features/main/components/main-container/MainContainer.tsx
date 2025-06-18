import React from 'react'
import styles from "./MainContainer.module.css";

const MainContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`${styles["main-container"]}`}>
      {children}
    </div>
  )
}

export default MainContainer;