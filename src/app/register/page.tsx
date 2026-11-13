"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Aperture, UserPlus } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim();
    const image = String(formData.get("image")).trim();
    const password = String(formData.get("password"));
    const confirmPassword = String(formData.get("confirmPassword"));

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain an uppercase letter");
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain a lowercase letter");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp.email({
        name,
        email,
        image,
        password,
        callbackURL: "/login",
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully!");
      router.push("/login");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-base-200 px-4 py-12">
      <div className="card w-full max-w-lg border border-base-300 bg-base-100 shadow-xl">
        <div className="card-body p-6 sm:p-10">
          <div className="mb-4 text-center">
            <div className="mb-4 flex justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-content">
                <Aperture size={32} />
              </span>
            </div>

            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="mt-2 text-sm text-base-content/60">
              Join StudioSpace and discover creative spaces.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="label font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                className="input input-bordered w-full"
                required
                minLength={2}
              />
            </div>

            <div>
              <label className="label font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label font-medium">
                Profile Photo URL
              </label>
              <input
                type="url"
                name="image"
                placeholder="https://example.com/photo.jpg"
                className="input input-bordered w-full"
                required
              />
              <p className="mt-1 text-xs text-base-content/50">
                Upload your photo to an image hosting service and paste its URL.
              </p>
            </div>

            <div>
              <label className="label font-medium">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                className="input input-bordered w-full"
                required
                minLength={6}
              />
              <p className="mt-1 text-xs text-base-content/50">
                At least 6 characters, including uppercase and lowercase letters.
              </p>
            </div>

            <div>
              <label className="label font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                className="input input-bordered w-full"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary mt-3 w-full"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="divider">OR</div>

          <p className="text-center text-sm text-base-content/70">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}