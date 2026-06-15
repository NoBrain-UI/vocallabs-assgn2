"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignInEmailPassword, useAuthenticationStatus } from "@nhost/nextjs";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthenticationStatus();
  const { signInEmailPassword, isLoading, isError, error } = useSignInEmailPassword();
  const [formError, setFormError] = useState<string>("");

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (email: string, password: string) => {
    setFormError("");
    const result = await signInEmailPassword(email, password);
    if (result.isError) {
      setFormError(result.error?.message || "Invalid email or password. Please try again.");
    } else if (result.isSuccess) {
      router.push("/dashboard");
    }
  };

  if (authLoading) return null;

  return (
    <AuthForm
      mode="login"
      onSubmit={handleSubmit}
      error={formError || (isError ? error?.message : undefined)}
      isLoading={isLoading}
    />
  );
}
