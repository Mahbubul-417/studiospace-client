
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  MapPin,
  Users,
  ArrowLeft,
  Clock,
  ShieldCheck,
  CalendarDays,
  Mail,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Studio {
  _id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  price: number;
  deposit: number;
  capacity: number;
  image: string;
  amenities: string[];
  hostEmail?: string;
}

export default function StudioDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong";

      setError(message);
      toast.error(message);
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

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
      </main>
    );
  }

  if (!studio) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold">Studio Not Found</h1>
          <p className="mt-3 text-base-content/60">
            {error || "This studio may have been removed or is unavailable."}
          </p>
          <button
            onClick={() => router.push("/studios")}
            className="btn btn-primary mt-6"
          >
            <ArrowLeft size={18} />
            Browse Studios
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-200 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.push("/studios")}
          className="btn btn-ghost mb-6"
        >
          <ArrowLeft size={18} />
          Back to Studios
        </button>

        <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
          <div className="relative">
            <img
              src={studio.image}
              alt={studio.title}
              className="h-72 w-full object-cover sm:h-96"
            />
            <span className="badge badge-primary absolute left-5 top-5 px-4 py-3">
              {studio.category}
            </span>
          </div>

          <div className="grid gap-10 p-6 md:grid-cols-[1fr_340px] md:p-10">
            <section>
              <div className="border-b border-base-300 pb-6">
                <h1 className="text-3xl font-bold md:text-4xl">
                  {studio.title}
                </h1>

                <p className="mt-3 flex items-center gap-2 text-base-content/60">
                  <MapPin size={18} />
                  {studio.location}
                </p>

                <div className="mt-5 flex flex-wrap gap-5 text-sm text-base-content/70">
                  <span className="flex items-center gap-2">
                    <Users size={18} />
                    Up to {studio.capacity} people
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={18} />
                    Hourly booking
                  </span>
                </div>
              </div>

              <section className="border-b border-base-300 py-7">
                <h2 className="text-xl font-bold">About This Studio</h2>
                <p className="mt-4 whitespace-pre-line leading-7 text-base-content/70">
                  {studio.description}
                </p>
              </section>

              <section className="border-b border-base-300 py-7">
                <h2 className="text-xl font-bold">Studio Amenities</h2>

                {studio.amenities?.length ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {studio.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 text-base-content/75"
                      >
                        <ShieldCheck
                          size={19}
                          className="shrink-0 text-primary"
                        />
                        {amenity}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-base-content/60">
                    No amenities have been listed.
                  </p>
                )}
              </section>

              {studio.hostEmail && (
                <section className="py-7">
                  <h2 className="text-xl font-bold">Contact the Host</h2>
                  <p className="mt-3 flex items-center gap-2 text-base-content/70">
                    <Mail size={18} className="text-primary" />
                    {studio.hostEmail}
                  </p>
                </section>
              )}
            </section>

            <aside>
              <div className="rounded-xl border border-base-300 p-6">
                <p className="text-sm text-base-content/60">
                  Starting price
                </p>

                <p className="mt-2 text-3xl font-bold text-primary">
                  ৳{studio.price.toLocaleString("en-BD")}
                  <span className="text-sm font-normal text-base-content/60">
                    {" "}/ hour
                  </span>
                </p>

                <div className="my-5 space-y-4 border-y border-base-300 py-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-base-content/60">
                      Security deposit
                    </span>
                    <span className="font-semibold">
                      ৳{studio.deposit.toLocaleString("en-BD")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-base-content/60">
                      Capacity
                    </span>
                    <span className="font-semibold">
                      {studio.capacity} people
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/studios/${studio._id}/book`)}
                  className="btn btn-primary w-full"
                >
                  <CalendarDays size={18} />
                  Book This Studio
                </button>

                <p className="mt-4 text-center text-xs text-base-content/50">
                  Booking details and availability will be confirmed during
                  the booking process.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
