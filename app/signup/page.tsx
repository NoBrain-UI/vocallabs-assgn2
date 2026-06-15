"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useSignUpEmailPassword,
  useAuthenticationStatus,
} from "@nhost/nextjs";
import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading: authLoading,
  } = useAuthenticationStatus();

  const {
    signUpEmailPassword,
    isLoading,
    isError,
    error,
  } = useSignUpEmailPassword();

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    setFormError("");
    setSuccessMessage("");

    const result = await signUpEmailPassword(email, password, {
      displayName: displayName || undefined,
    });

    console.log("signup result", result);

    // Error case
    if (result.isError) {
      setFormError(
        result.error?.message || "Sign up failed. Please try again."
      );
      return;
    }

    // Email verification case
    if (result.needsEmailVerification) {
      setSuccessMessage(
        "Verification email sent. Please check your inbox and verify your account."
      );
      return;
    }

    // Auto-login case
    router.push("/dashboard");
  };

  if (authLoading) return null;

  return (
    <>
      <AuthForm
        mode="signup"
        onSubmit={handleSubmit}
        error={formError || (isError ? error?.message : undefined)}
        isLoading={isLoading}
      />

      {successMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#16a34a",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "8px",
            zIndex: 9999,
            fontWeight: 500,
          }}
        >
          {successMessage}
        </div>
      )}
    </>
  );
}