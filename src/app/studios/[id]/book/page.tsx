
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Loader2,
  MapPin,
  ShieldCheck,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Studio {
  _id: string;
  title: string;
  category: string;
  location: string;
  price: number;
  deposit: number;
  image: string;
}

function getLocalDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function BookStudioPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data: session, isPending: sessionPending } = useSession();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [duration, setDuration] = useState("1");

  const bookingPath = `/studios/${params.id}/book`;

  useEffect(() => {
    if (!sessionPending && !session?.user) {
      router.replace(
        `/login?callbackURL=${encodeURIComponent(bookingPath)}`
      );
    }
  }, [sessionPending, session, router, bookingPath]);

  const fetchStudio = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/studios/${params.id}`,
        { cache: "no-store" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load studio");
      }

      setStudio(result.data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load studio"
      );
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudio();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchStudio]);

  async function handleBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!studio || !date || !startTime) {
      toast.error("Please complete all booking details");
      return;
    }

    if (date < getLocalDate()) {
      toast.error("Please select today or a future date");
      return;
    }

    try {
      setSubmitting(true);

      const tokenResponse = await fetch("/api/auth/token");

      if (!tokenResponse.ok) {
        router.push(
          `/login?callbackURL=${encodeURIComponent(bookingPath)}`
        );
        return;
      }

      const tokenData = await tokenResponse.json();

      if (!tokenData.token) {
        router.push(
          `/login?callbackURL=${encodeURIComponent(bookingPath)}`
        );
        return;
      }

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({
          studioId: studio._id,
          date,
          startTime,
          duration: Number(duration),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking request failed");
      }

      toast.success("Booking request submitted successfully!");
      router.push("/my-bookings");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (sessionPending || !session?.user || loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
      </main>
    );
  }

  if (!studio) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold">Studio Not Found</h1>
        <Link href="/studios" className="btn btn-primary mt-5">
          Browse Studios
        </Link>
      </main>
    );
  }

  const totalPrice = studio.price * Number(duration);

  return (
    <main className="min-h-screen bg-base-200 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/studios/${studio._id}`}
          className="btn btn-ghost mb-6"
        >
          <ArrowLeft size={18} />
          Back to Studio
        </Link>

        <div className="grid gap-8 md:grid-cols-[1fr_380px]">
          <section className="rounded-2xl border border-base-300 bg-base-100 p-6 md:p-8">
            <h1 className="text-3xl font-bold">Book Your Studio</h1>
            <p className="mt-2 text-base-content/60">
              Choose your preferred date and booking time.
            </p>

            <form onSubmit={handleBooking} className="mt-8 space-y-6">
              <div>
                <label className="mb-2 block font-semibold">
                  Booking Date
                </label>
                <input
                  type="date"
                  min={getLocalDate()}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Starting Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  required
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  className="select select-bordered w-full"
                >
                  {Array.from({ length: 12 }, (_, index) => index + 1).map(
                    (hour) => (
                      <option key={hour} value={hour}>
                        {hour} {hour === 1 ? "Hour" : "Hours"}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="rounded-xl bg-base-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-base-content/60">
                    Rental cost
                  </span>
                  <span className="font-semibold">
                    ৳{totalPrice.toLocaleString("en-BD")}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-base-content/60">
                    Security deposit
                  </span>
                  <span className="font-semibold">
                    ৳{studio.deposit.toLocaleString("en-BD")}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-base-300 pt-4">
                  <span className="font-bold">Rental Total</span>
                  <span className="text-xl font-extrabold text-primary">
                    ৳{totalPrice.toLocaleString("en-BD")}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CalendarDays size={18} />
                    Confirm Booking Request
                  </>
                )}
              </button>

              <p className="text-center text-xs text-base-content/50">
                Your request will be submitted as pending until the host
                responds.
              </p>
            </form>
          </section>

          <aside className="h-fit overflow-hidden rounded-2xl border border-base-300 bg-base-100">
            <img
              src={studio.image}
              alt={studio.title}
              className="h-56 w-full object-cover"
            />

            <div className="p-6">
              <span className="badge badge-primary">
                {studio.category}
              </span>

              <h2 className="mt-3 text-xl font-bold">
                {studio.title}
              </h2>

              <p className="mt-2 flex items-center gap-2 text-sm text-base-content/60">
                <MapPin size={16} />
                {studio.location}
              </p>

              <div className="mt-5 space-y-3 border-t border-base-300 pt-5">
                <p className="flex items-center gap-2 text-sm">
                  <Clock size={17} className="text-primary" />
                  ৳{studio.price.toLocaleString("en-BD")} per hour
                </p>

                <p className="flex items-center gap-2 text-sm">
                  <ShieldCheck size={17} className="text-primary" />
                  Security deposit required
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
