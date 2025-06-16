import React from "react";
import Link from "next/link";

interface SafeMailtoLinkProps {
	user: string;
	domain: string;
	className?: string;
	children?: React.ReactNode;
}

// Gmail の compose 画面を直接開くリンクを生成
// 例: https://mail.google.com/mail/?view=cm&fs=1&to=user@example.com
const generateGmailLink = (user: string, domain: string): string => {
	const to = encodeURIComponent(`${user}@${domain}`);
	return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}`;
};

const SafeMailtoLink: React.FC<SafeMailtoLinkProps> = ({
	user,
	domain,
	className = "",
	children,
}) => {
	const gmailLink = generateGmailLink(user, domain);
	const displayEmail = `${user}@${domain}`;

	return (
		<Link
			href={gmailLink}
			className={className}
			target="_blank"
			rel="noopener noreferrer"
		>
			{children || displayEmail}
		</Link>
	);
};

export default SafeMailtoLink;
