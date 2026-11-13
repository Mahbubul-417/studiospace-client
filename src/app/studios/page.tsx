"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowRight,
  Camera,
} from "lucide-react";

const studios = [
  {
    id: "1",
    title: "The White Canvas Studio",
    category: "Photo Studios",
    location: "New York, USA",
    price: 65,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
  },
  {
    id: "2",
    title: "Cinematic Production Stage",
    category: "Sound Stages",
    location: "Los Angeles, USA",
    price: 120,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800",
  },
  {
    id: "3",
    title: "The Podcast Corner",
    category: "Podcast Rooms",
    location: "Chicago, USA",
    price: 45,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800",
  },
  {
    id: "4",
    title: "Echo Music Studio",
    category: "Music Suites",
    location: "Austin, USA",
    price: 80,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800",
  },
  {
    id: "5",
    title: "Creative Art House",
    category: "Art Workshops",
    location: "Brooklyn, USA",
    price: 55,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
  },
  {
    id: "6",
    title: "Urban Photography Loft",
    category: "Photo Studios",
    location: "Miami, USA",
    price: 75,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
  },
];

const categories = [
  "All Categories",
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

export default function StudiosPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sort, setSort] = useState("default");

  const filteredStudios = useMemo(() => {
    let result = studios.filter((studio) => {
      const matchesSearch =
        studio.title.toLowerCase().includes(search.toLowerCase()) ||
        studio.location.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All Categories" ||
        studio.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [search, category, sort]);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Page Banner */}
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
                onChange={(e) => setSearch(e.target.value)}
                className="grow"
              />
            </label>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All Categories");
                setSort("default");
              }}
              className="btn btn-outline"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      {/* Studios */}
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
                onChange={(e) => setCategory(e.target.value)}
                className="select select-sm border-none bg-transparent focus:outline-none"
              >
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
                onChange={(e) => setSort(e.target.value)}
                className="select select-sm border-none bg-transparent focus:outline-none"
              >
                <option value="default">Default Sorting</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </label>
          </div>
        </div>

        {filteredStudios.length > 0 ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStudios.map((studio) => (
              <article
                key={studio.id}
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

                  <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-base-100 px-3 py-1.5 text-sm font-bold">
                    <Star
                      size={15}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    {studio.rating}
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

                  <div className="mt-5 flex items-center justify-between border-t border-base-300 pt-4">
                    <div>
                      <p className="text-xl font-extrabold text-primary">
                        ${studio.price}
                        <span className="text-sm font-normal text-base-content/60">
                          {" "}/ hr
                        </span>
                      </p>
                    </div>

                    <Link
                      href={`/studios/${studio.id}`}
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
              We couldn&apos;t find any studios matching your search.
              Try changing your search or category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All Categories");
              }}
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