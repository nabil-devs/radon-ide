"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

interface WaitlistFormProps {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
  className?: string;
  onSubmit?: (email: string) => Promise<void>;
  variant?: "default" | "compact" | "hero";
}

const WaitlistForm: React.FC<WaitlistFormProps> = ({
  title = "Join the Waitlist",
  subtitle = "Be the first to know about new features and updates.",
  placeholder = "Enter your email address",
  buttonText = "Join Waitlist",
  successMessage = "Thank you! We'll be in touch soon.",
  className,
  onSubmit,
  variant = "default",
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(email);
      } else {
        // Default behavior - simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Waitlist signup:", email);
      }
      
      setIsSubmitted(true);
      setEmail("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={clsx(styles.waitlistForm, styles[variant], className)}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>✓</div>
          <p className={styles.successMessage}>{successMessage}</p>
          <button
            className={styles.resetButton}
            onClick={() => setIsSubmitted(false)}
          >
            Join another email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(styles.waitlistForm, styles[variant], className)}>
      {variant !== "compact" && (
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputContainer}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className={clsx(styles.emailInput, error && styles.error)}
            disabled={isLoading}
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className={styles.submitButton}
          >
            {isLoading ? (
              <span className={styles.loader}></span>
            ) : (
              buttonText
            )}
          </button>
        </div>
        
        {error && <p className={styles.errorMessage}>{error}</p>}
      </form>
    </div>
  );
};

export default WaitlistForm;