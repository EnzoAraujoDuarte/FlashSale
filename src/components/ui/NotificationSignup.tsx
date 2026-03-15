"use client";

import { motion } from "framer-motion";
import { type FormEvent, useId, useState } from "react";

import { Button } from "@/components/primitives/Button";
import { Body, Label } from "@/components/primitives/Typography";
import { useToast } from "@/hooks/useToast";
import { fadeInScale } from "@/lib/motion";

interface NotificationSignupProps {
  title: string;
  support: string;
  submitLabel?: string;
  successTitle?: string;
  successMessage: string;
  onSuccess?: () => void;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function NotificationSignup({
  onSuccess,
  submitLabel = "Notify me",
  successTitle = "Reminder confirmed",
  successMessage,
  support,
  title
}: NotificationSignupProps) {
  const fieldId = useId();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setError("");
    setEmail("");
    showToast({
      variant: "success",
      title: successTitle,
      description: successMessage
    });
    onSuccess?.();
  };

  return (
    <motion.form
      animate="animate"
      className="notification-signup"
      data-no-cursor
      initial="initial"
      onSubmit={handleSubmit}
      variants={fadeInScale}
    >
      <div className="notification-signup__copy">
        <Label>{title}</Label>
        <Body>{support}</Body>
      </div>

      <div className="notification-signup__field">
        <label className="notification-signup__label" htmlFor={fieldId}>
          Email
        </label>
        <input
          aria-describedby={error ? `${fieldId}-error` : undefined}
          aria-invalid={Boolean(error)}
          autoComplete="email"
          autoFocus
          className="notification-signup__input"
          data-no-cursor
          id={fieldId}
          inputMode="email"
          name="email"
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) {
              setError("");
            }
          }}
          placeholder="your@email.com"
          type="email"
          value={email}
        />
        {error ? (
          <span className="notification-signup__error" id={`${fieldId}-error`} role="alert">
            {error}
          </span>
        ) : null}
      </div>

      <Button cursor="go" fullWidth type="submit">
        {submitLabel}
      </Button>
    </motion.form>
  );
}
