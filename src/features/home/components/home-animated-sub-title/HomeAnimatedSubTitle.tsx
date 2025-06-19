"use client";

import React from "react";
import styles from "./HomeAnimatedSubTitle.module.css";
import { useState, useEffect } from "react";

const HomeAnimatedSubTitle = () => {
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsActive(true);
		}, 8200);
		return () => clearTimeout(timer);
	}, []);

	return (
		<h2
			className={`${styles["subtitle"]} ${
				isActive ? styles["active-subtitle"] : ""
			}`}
		>
			叡智の継承者
		</h2>
	);
};

export default HomeAnimatedSubTitle;
