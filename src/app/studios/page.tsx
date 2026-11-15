
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowRight,
  Camera,
  Loader2,
  Users,
} from "lucide-react";

const API_URL = "http://localhost:5000";

interface Studio {
  _id: string;
  title: string;
  category: string;
  location: string;
  price: number;
  capacity: number;
  image: string;
  description: string;
}

export default function StudiosPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudios = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/studios`, {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load studios");
      }

      const studioList: Studio[] = result.data || [];

      setStudios(studioList);

      setCategories(
        Array.from(
          new Set(studioList.map((studio) => studio.category))
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudios();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchStudios]);

  const filteredStudios = studios
    .filter((studio) => {
      const matchesSearch =
        studio.title.toLowerCase().includes(search.toLowerCase()) ||
        studio.location.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All Categories" ||
        studio.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return 0;
    });

  function clearFilters() {
    setSearch("");
    setCategory("All Categories");
    setSort("default");
  }

  return (
    <div className="min-h-screen bg-base-100">
      <section className="bg-base-200 px-5 py-16 md:px-10">
        <div className="mx-auto max-w-7xl">
          <span className="font-semibold uppercase tracking-widest text-primary">
            Explore creative possibilities
          </span>

          <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
            Find Your Perfect Studio
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-base-content/60">
            Discover inspiring creative spaces for photography,
            filmmaking, podcasting, music production, and more.
          </p>

          <div className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <label className="input input-bordered flex flex-1 items-center gap-3 bg-base-100">
              <Search size={20} className="text-base-content/50" />
              <input
                type="text"
                placeholder="Search studio or location..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="grow"
              />
            </label>

            <button
              onClick={clearFilters}
              className="btn btn-outline"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-extrabold">
              Available Studios
            </h2>

            <p className="mt-2 text-sm text-base-content/60">
              Showing {filteredStudios.length} creative spaces
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex items-center gap-2 rounded-lg border border-base-300 px-3">
              <SlidersHorizontal size={17} />

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="select select-sm border-none bg-base-100 text-base-content focus:outline-none"
              >
                <option value="All Categories">All Categories</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-2 rounded-lg border border-base-300 px-3">
              <ArrowUpDown size={17} />

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="select select-sm border-none bg-base-100 text-base-content focus:outline-none"
              >
                <option value="default">Default Sorting</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={36} />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-base-300 bg-base-200 px-5 py-16 text-center">
            <h3 className="text-xl font-bold">
              Unable to Load Studios
            </h3>
            <p className="mt-2 text-sm text-base-content/60">
              {error}
            </p>
            <button
              onClick={fetchStudios}
              className="btn btn-primary mt-6"
            >
              Try Again
            </button>
          </div>
        ) : filteredStudios.length > 0 ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStudios.map((studio) => (
              <article
                key={studio._id}
                className="group overflow-hidden rounded-2xl border border-base-300 bg-base-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={studio.image}
                    alt={studio.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-base-100 px-3 py-1.5 text-xs font-bold text-primary">
                    {studio.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold">
                    {studio.title}
                  </h3>

                  <p className="mt-2 flex items-center gap-2 text-sm text-base-content/60">
                    <MapPin size={16} />
                    {studio.location}
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-sm text-base-content/60">
                    <Users size={16} />
                    Capacity: {studio.capacity} people
                  </p>

                  <p className="mt-3 line-clamp-2 text-sm text-base-content/60">
                    {studio.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-base-300 pt-4">
                    <div>
                      <p className="text-xl font-extrabold text-primary">
                        ৳{studio.price.toLocaleString("en-BD")}
                        <span className="text-sm font-normal text-base-content/60">
                          {" "}/ hr
                        </span>
                      </p>
                    </div>

                    <Link
                      href={`/studios/${studio._id}`}
                      className="btn btn-primary btn-sm rounded-lg"
                    >
                      View Details
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-base-300 px-5 py-20 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-base-200 text-base-content/50">
              <Camera size={30} />
            </span>

            <h3 className="mt-5 text-xl font-bold">
              No Studios Found
            </h3>

            <p className="mt-2 max-w-md text-sm text-base-content/60">
              No studios match your search. Try changing your filters.
            </p>

            <button
              onClick={clearFilters}
              className="btn btn-primary mt-6"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
