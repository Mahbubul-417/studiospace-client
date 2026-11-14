
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  Loader2,
  CheckCircle,
  XCircle,
  ClipboardList,
} from "lucide-react";

const API_URL = "http://localhost:5000";

interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  userEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
}

export default function HostBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const tokenResponse = await fetch("/api/auth/token");
      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error("Please log in to view booking requests");
      }

      const response = await fetch(
        `${API_URL}/api/bookings/host-bookings`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load booking requests");
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

  async function updateStatus(
    bookingId: string,
    status: "Confirmed" | "Cancelled"
  ) {
    try {
      setUpdatingId(bookingId);

      const tokenResponse = await fetch("/api/auth/token");
      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error("Please log in again");
      }

      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to update booking");
      }

      setBookings((current) =>
        current.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status }
            : booking
        )
      );

      toast.success(
        status === "Confirmed"
          ? "Booking confirmed successfully"
          : "Booking cancelled successfully"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setUpdatingId("");
    }
  }

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
            Manage your reservations
          </span>

          <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
            Booking Requests
          </h1>

          <p className="mt-3 text-base-content/60">
            Review incoming requests and manage your studio reservations.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-base-300 bg-base-100 px-5 py-16 text-center">
            <h2 className="text-xl font-bold">Unable to Load Requests</h2>
            <p className="mt-3 text-sm text-base-content/60">{error}</p>
            <button onClick={fetchBookings} className="btn btn-primary mt-6">
              Try Again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-base-300 bg-base-100 px-5 py-20 text-center">
            <ClipboardList size={32} className="text-base-content/50" />
            <h2 className="mt-5 text-xl font-bold">No Booking Requests</h2>
            <p className="mt-2 text-sm text-base-content/60">
              You haven&apos;t received any booking requests for your studios yet.
            </p>
            <Link href="/my-listings" className="btn btn-primary mt-6">
              View My Listings
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-base-content/60">
              {bookings.length}{" "}
              {bookings.length === 1 ? "request" : "requests"} found
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {bookings.map((booking) => (
                <article
                  key={booking._id}
                  className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row">
                    <img
                      src={booking.studioImage}
                      alt={booking.studioTitle}
                      className="h-48 w-full object-cover sm:h-auto sm:w-40"
                    />

                    <div className="flex-1 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                          Incoming Reservation
                        </span>
                        <span className={`badge ${getStatusStyle(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>

                      <h2 className="mt-3 text-xl font-bold">
                        {booking.studioTitle}
                      </h2>

                      <p className="mt-2 break-all text-sm text-base-content/60">
                        Customer: {booking.userEmail}
                      </p>

                      <div className="mt-4 space-y-3 text-sm text-base-content/65">
                        <p className="flex items-center gap-2">
                          <CalendarDays size={17} className="text-primary" />
                          {formatDate(booking.date)}
                        </p>

                        <p className="flex items-center gap-2">
                          <Clock size={17} className="text-primary" />
                          {booking.startTime} – {booking.endTime}
                          ({booking.duration} hours)
                        </p>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-base-300 pt-4">
                        <div>
                          <p className="text-xs text-base-content/50">
                            Rental Total
                          </p>
                          <p className="text-xl font-extrabold text-primary">
                            ৳{booking.totalPrice.toLocaleString("en-BD")}
                          </p>
                        </div>

                        {booking.status === "Pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                updateStatus(booking._id, "Confirmed")
                              }
                              disabled={updatingId === booking._id}
                              className="btn btn-success btn-sm"
                            >
                              {updatingId === booking._id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <CheckCircle size={16} />
                              )}
                              Confirm
                            </button>

                            <button
                              onClick={() =>
                                updateStatus(booking._id, "Cancelled")
                              }
                              disabled={updatingId === booking._id}
                              className="btn btn-error btn-outline btn-sm"
                            >
                              <XCircle size={16} />
                              Cancel
                            </button>
                          </div>
                        )}
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
