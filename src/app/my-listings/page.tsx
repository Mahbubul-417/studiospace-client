
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Loader2,
    Trash2,
    Pencil,
    MapPin,
    Users,
    Plus,
} from "lucide-react";

const API_URL = "http://localhost:5000";

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
}

export default function MyListingsPage() {
    const router = useRouter();

    const [studios, setStudios] = useState<Studio[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);

    const fetchListings = useCallback(async () => {
        try {
            const tokenResponse = await fetch("/api/auth/token");

            if (!tokenResponse.ok) {
                router.push("/login?callbackURL=/my-listings");
                return;
            }

            const tokenData = await tokenResponse.json();

            if (!tokenData.token) {
                router.push("/login?callbackURL=/my-listings");
                return;
            }

            const response = await fetch(`${API_URL}/api/studios/my-listings`, {
                headers: {
                    Authorization: `Bearer ${tokenData.token}`,
                },
                cache: "no-store",
            });

            if (response.status === 401) {
                router.push("/login?callbackURL=/my-listings");
                return;
            }

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to load listings");
            }

            setStudios(result.data || []);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchListings();
        }, 0);

        return () => clearTimeout(timer);
    }, [fetchListings]);

    async function handleDelete() {
        if (!selectedStudio) return;

        setDeleting(true);

        try {
            const tokenResponse = await fetch("/api/auth/token");

            if (!tokenResponse.ok) {
                throw new Error("Please log in to continue");
            }

            const tokenData = await tokenResponse.json();

            if (!tokenData.token) {
                throw new Error("Authentication token not found");
            }

            const response = await fetch(
                `${API_URL}/api/studios/${selectedStudio._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                    },
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to delete listing");
            }

            setStudios((previous) =>
                previous.filter((studio) => studio._id !== selectedStudio._id)
            );

            toast.success("Studio listing deleted successfully");
            setSelectedStudio(null);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );
        } finally {
            setDeleting(false);
        }
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
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
                            Host Dashboard
                        </p>
                        <h1 className="text-3xl font-bold md:text-4xl">
                            My Listings
                        </h1>
                        <p className="mt-2 text-base-content/60">
                            Manage the creative spaces you have listed.
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/add-studio")}
                        className="btn btn-primary"
                    >
                        <Plus size={18} />
                        Add New Studio
                    </button>
                </div>

                {studios.length === 0 ? (
                    <div className="rounded-2xl border border-base-300 bg-base-100 px-6 py-16 text-center">
                        <h2 className="text-xl font-semibold">
                            You haven&apos;t listed any studios yet
                        </h2>
                        <p className="mt-2 text-base-content/60">
                            Share your creative space with others by creating your first listing.
                        </p>
                        <button
                            onClick={() => router.push("/add-studio")}
                            className="btn btn-primary mt-6"
                        >
                            <Plus size={18} />
                            List Your Studio
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="mb-5 text-sm text-base-content/60">
                            {studios.length} {studios.length === 1 ? "listing" : "listings"} found
                        </p>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {studios.map((studio) => (
                                <article
                                    key={studio._id}
                                    className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm"
                                >
                                    <img
                                        src={studio.image}
                                        alt={studio.title}
                                        className="h-52 w-full object-cover"
                                    />

                                    <div className="p-5">
                                        <div className="mb-3 flex items-start justify-between gap-3">
                                            <div>
                                                <span className="badge badge-primary badge-outline mb-2">
                                                    {studio.category}
                                                </span>
                                                <h2 className="text-xl font-bold">
                                                    {studio.title}
                                                </h2>
                                            </div>
                                        </div>

                                        <p className="mb-4 line-clamp-2 text-sm text-base-content/60">
                                            {studio.description}
                                        </p>

                                        <div className="space-y-2 text-sm text-base-content/70">
                                            <p className="flex items-center gap-2">
                                                <MapPin size={16} />
                                                {studio.location}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <Users size={16} />
                                                Capacity: {studio.capacity} people
                                            </p>
                                        </div>

                                        <div className="mt-4 border-t border-base-300 pt-4">
                                            <p className="text-lg font-bold text-primary">
                                                ৳{studio.price.toLocaleString("en-BD")}
                                                <span className="text-sm font-normal text-base-content/60">
                                                    {" "}/ hour
                                                </span>
                                            </p>
                                            <p className="mt-1 text-xs text-base-content/60">
                                                Deposit: ৳{studio.deposit.toLocaleString("en-BD")}
                                            </p>
                                        </div>

                                        <div className="mt-5 flex gap-3">
                                            <button
                                                onClick={() =>
                                                    router.push(`/my-listings/${studio._id}/edit`)
                                                }
                                                className="btn btn-outline btn-primary flex-1"
                                            >
                                                <Pencil size={16} />
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => setSelectedStudio(studio)}
                                                className="btn btn-outline btn-error flex-1"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {selectedStudio && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="text-xl font-bold">Delete Studio Listing?</h3>
                        <p className="py-4 text-base-content/70">
                            Are you sure you want to delete{" "}
                            <strong>{selectedStudio.title}</strong>? This action cannot be undone.
                        </p>

                        <div className="modal-action">
                            <button
                                onClick={() => setSelectedStudio(null)}
                                disabled={deleting}
                                className="btn btn-ghost"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="btn btn-error"
                            >
                                {deleting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={18} />
                                        Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
