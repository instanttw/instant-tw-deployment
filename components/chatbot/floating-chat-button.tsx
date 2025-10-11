"use client";

import { motion } from "framer-motion";
import "./floating-chat-button.css";

interface FloatingChatButtonProps {
  onClick?: () => void;
  notificationCount?: number;
  showPulse?: boolean;
}

export function FloatingChatButton({ 
  onClick, 
  notificationCount = 0,
  showPulse = true 
}: FloatingChatButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      console.log("Chat button clicked");
    }
  };

  return (
    <motion.button
      className="floating-chat-button"
      onClick={handleClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5
      }}
      aria-label="Open chat support"
      role="button"
      tabIndex={0}
    >
      {/* Pulse animation ring */}
      {showPulse && (
        <span className="pulse-ring" aria-hidden="true" />
      )}

      {/* Chat icon SVG */}
      <svg
        className="chat-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.418 16.97 20 12 20C10.5286 20 9.13759 19.6759 7.8952 19.0971L3 20L4.3515 16.1974C3.4656 15.0038 3 13.5594 3 12C3 7.582 7.03 4 12 4C16.97 4 21 7.582 21 12Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Notification badge */}
      {notificationCount > 0 && (
        <span 
          className="notification-badge"
          aria-label={`${notificationCount} unread messages`}
        >
          {notificationCount > 9 ? '9+' : notificationCount}
        </span>
      )}
    </motion.button>
  );
}
