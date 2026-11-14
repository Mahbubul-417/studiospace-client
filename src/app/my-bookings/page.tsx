
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  MapPin,
  Loader2,
  ArrowRight,
  ClipboardList,
} from "lucide-react";

const API_URL = "http://localhost:5000";

interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const tokenResponse = await fetch("/api/auth/token");

      if (!tokenResponse.ok) {
        throw new Error("Please log in to view your bookings");
      }

      const tokenData = await tokenResponse.json();

      if (!tokenData.token) {
        throw new Error("Please log in to view your bookings");
      }

      const response = await fetch(
        `${API_URL}/api/bookings/my-bookings`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load bookings");
      }

      setBookings(result.data || []);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchBookings]);

  function getStatusStyle(status: Booking["status"]) {
    switch (status) {
      case "Confirmed":
        return "badge-success";
      case "Pending":
        return "badge-warning";
      case "Completed":
        return "badge-info";
      case "Cancelled":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  }

  function formatDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-200 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <span className="font-semibold uppercase tracking-widest text-primary">
            Your reservations
          </span>

          <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
            My Bookings
          </h1>

          <p className="mt-3 text-base-content/60">
            Keep track of your studio reservations and booking status.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-base-300 bg-base-100 px-5 py-16 text-center">
            <h2 className="text-xl font-bold">
              Unable to Load Bookings
            </h2>

            <p className="mt-3 text-sm text-base-content/60">
              {error}
            </p>

            <button
              onClick={fetchBookings}
              className="btn btn-primary mt-6"
            >
              Try Again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-base-300 bg-base-100 px-5 py-20 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-base-200 text-base-content/50">
              <ClipboardList size={30} />
            </span>

            <h2 className="mt-5 text-xl font-bold">
              No Bookings Yet
            </h2>

            <p className="mt-2 max-w-md text-sm text-base-content/60">
              You haven&apos;t booked any creative spaces yet. Explore our
              studios and find the perfect space for your next project.
            </p>

            <Link href="/studios" className="btn btn-primary mt-6">
              Explore Studios
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-base-content/60">
                {bookings.length}{" "}
                {bookings.length === 1 ? "booking" : "bookings"} found
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {bookings.map((booking) => (
                <article
                  key={booking._id}
                  className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row">
                    <img
                      src={booking.studioImage}
                      alt={booking.studioTitle}
                      className="h-52 w-full object-cover sm:h-auto sm:w-44"
                    />

                    <div className="flex-1 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                          Studio Reservation
                        </span>

                        <span
                          className={`badge ${getStatusStyle(booking.status)}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <h2 className="mt-3 text-xl font-bold">
                        {booking.studioTitle}
                      </h2>

                      <div className="mt-4 space-y-3 text-sm text-base-content/65">
                        <p className="flex items-center gap-2">
                          <CalendarDays size={17} className="text-primary" />
                          {formatDate(booking.date)}
                        </p>

                        <p className="flex items-center gap-2">
                          <Clock size={17} className="text-primary" />
                          {booking.startTime} – {booking.endTime}
                        </p>

                        <p className="flex items-center gap-2">
                          <MapPin size={17} className="text-primary" />
                          {booking.duration}{" "}
                          {booking.duration === 1 ? "hour" : "hours"}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-base-300 pt-4">
                        <div>
                          <p className="text-xs text-base-content/50">
                            Rental Total
                          </p>

                          <p className="text-xl font-extrabold text-primary">
                            ৳{booking.totalPrice.toLocaleString("en-BD")}
                          </p>
                        </div>

                        <Link
                          href={`/studios/${booking.studioId}`}
                          className="btn btn-outline btn-sm"
                        >
                          View Studio
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
