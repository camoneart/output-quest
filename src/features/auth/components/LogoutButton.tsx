"use client";

import { logout } from "../api/logout";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className = "" }: LogoutButtonProps) {
  const handleLogout = () => {
    logout();
  };

  return (
    <button
      onClick={handleLogout}
      className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md ${className}`}
    >
      ログアウト
    </button>
  );
}
