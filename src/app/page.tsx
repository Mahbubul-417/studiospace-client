"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import {
  Camera,
  Film,
  Mic,
  Music,
  Palette,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Star,
  ShieldCheck,
  BadgeCheck,
  Headphones,
  Clock,
  Search,
  CalendarCheck,
  Sparkles,
} from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    title: "Your Vision. Your Space. Your Masterpiece.",
    description:
      "Discover extraordinary creative spaces designed to bring your next big idea to life.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1800",
  },
  {
    title: "Find the Perfect Space to Create.",
    description:
      "From professional photography studios to cinematic sound stages, find your creative home.",
    image:
      "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=1800",
  },
  {
    title: "Turn Creative Ideas Into Reality.",
    description:
      "Book inspiring spaces, connect with hosts, and make something unforgettable.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1800",
  },
];

const categories = [
  {
    name: "Photo Studios",
    description: "Perfect lighting for every shot.",
    icon: Camera,
  },
  {
    name: "Sound Stages",
    description: "Bring cinematic visions to life.",
    icon: Film,
  },
  {
    name: "Podcast Rooms",
    description: "Make every conversation count.",
    icon: Mic,
  },
  {
    name: "Music Suites",
    description: "Create your next great sound.",
    icon: Music,
  },
  {
    name: "Art Workshops",
    description: "Space for imagination to grow.",
    icon: Palette,
  },
];

const featuredStudios = [
  {
    id: "1",
    title: "The White Canvas Studio",
    category: "Photo Studios",
    location: "New York, USA",
    price: 65,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
  },
  {
    id: "2",
    title: "Cinematic Production Stage",
    category: "Sound Stages",
    location: "Los Angeles, USA",
    price: 120,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800",
  },
  {
    id: "3",
    title: "The Podcast Corner",
    category: "Podcast Rooms",
    location: "Chicago, USA",
    price: 45,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800",
  },
  {
    id: "4",
    title: "Echo Music Studio",
    category: "Music Suites",
    location: "Austin, USA",
    price: 80,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800",
  },
  {
    id: "5",
    title: "Creative Art House",
    category: "Art Workshops",
    location: "Brooklyn, USA",
    price: 55,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
  },
  {
    id: "6",
    title: "Urban Photography Loft",
    category: "Photo Studios",
    location: "Miami, USA",
    price: 75,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
  },
];

const bookingSteps = [
  {
    number: "01",
    title: "Discover Spaces",
    description:
      "Explore a curated collection of creative studios that match your vision.",
    icon: Search,
  },
  {
    number: "02",
    title: "Select Shoot Hours",
    description:
      "Choose your preferred date, time, and the duration of your session.",
    icon: Clock,
  },
  {
    number: "03",
    title: "Book Instantly",
    description:
      "Reserve your favorite space and manage your booking with ease.",
    icon: CalendarCheck,
  },
  {
    number: "04",
    title: "Create & Produce",
    description:
      "Show up, get inspired, and bring your creative ideas to life.",
    icon: Sparkles,
  },
];

const guarantees = [
  {
    title: "Liability Protection",
    description:
      "Enjoy greater peace of mind with clear booking policies and platform support.",
    icon: ShieldCheck,
  },
  {
    title: "Verified Profiles",
    description:
      "Connect with studio hosts and creators through trusted profiles.",
    icon: BadgeCheck,
  },
  {
    title: "Equipment Safety",
    description:
      "Find studio information and equipment details before making a reservation.",
    icon: Camera,
  },
  {
    title: "Creator Support",
    description:
      "Get help with your bookings and studio experience whenever you need it.",
    icon: Headphones,
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Slider */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          slidesPerView={1}
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation
          className="h-[560px] md:h-[650px]"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.title}>
              <div
                className="relative flex h-full items-center bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black/65" />

                <div className="relative z-10 mx-auto w-full max-w-7xl px-8 text-white md:px-16">
                  <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm backdrop-blur">
                    <Sparkles size={16} />
                    Welcome to StudioSpace
                  </span>

                  <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
                    {slide.title}
                  </h1>

                  <p className="mt-6 max-w-xl text-base leading-8 text-white/80 md:text-lg">
                    {slide.description}
                  </p>

                  <div className="mt-9 flex flex-wrap gap-4">
                    <Link
                      href="/studios"
                      className="btn btn-primary btn-lg rounded-xl"
                    >
                      Explore Studios
                      <ArrowRight size={19} />
                    </Link>

                    <Link
                      href="/add-studio"
                      className="btn btn-outline btn-lg rounded-xl border-white text-white hover:border-white hover:bg-white hover:text-black"
                    >
                      Host Your Space
                    </Link>
                  </div>
                </div>

                <div className="absolute bottom-12 right-10 hidden text-sm font-medium text-white/70 md:block">
                  0{index + 1} / 03
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Featured Studios */}
      <section className="bg-base-100 px-5 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <span className="font-semibold uppercase tracking-widest text-primary">
                Handpicked for creators
              </span>
              <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
                Featured Studios
              </h2>
              <p className="mt-3 text-base-content/60">
                Explore inspiring spaces for your next creative project.
              </p>
            </div>

            <Link
              href="/studios"
              className="flex items-center gap-2 font-semibold text-primary hover:gap-3"
            >
              View All Studios <ArrowUpRight size={19} />
            </Link>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {featuredStudios.map((studio) => (
              <article
                key={studio.id}
                className="group overflow-hidden rounded-2xl border border-base-300 bg-base-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={studio.image}
                    alt={studio.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-base-100 px-3 py-1.5 text-xs font-bold text-primary">
                    {studio.category}
                  </span>

                  <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-base-100 px-3 py-1.5 text-sm font-bold">
                    <Star size={15} className="fill-yellow-400 text-yellow-400" />
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
                    <p className="text-lg font-extrabold text-primary">
                      ${studio.price}
                      <span className="text-sm font-normal text-base-content/60">
                        {" "}/ hr
                      </span>
                    </p>

                    <Link
                      href={`/studios/${studio.id}`}
                      className="btn btn-primary btn-sm rounded-lg"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-base-200 px-5 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="font-semibold uppercase tracking-widest text-primary">
              Find your creative environment
            </span>
            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
              Explore by Category
            </h2>
            <p className="mt-4 text-base-content/60">
             Whatever you&apos;re creating, there&apos;s a space waiting for you.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  href={`/studios?category=${encodeURIComponent(category.name)}`}
                  className="group rounded-2xl border border-base-300 bg-base-100 p-7 text-center transition-all hover:-translate-y-2 hover:border-primary hover:shadow-lg"
                >
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content">
                    <Icon size={30} />
                  </span>

                  <h3 className="mt-5 font-bold">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm text-base-content/60">
                    {category.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Explore <ArrowRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking Process */}
      <section
        id="how-it-works"
        className="bg-base-100 px-5 py-20 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="font-semibold uppercase tracking-widest text-primary">
              Simple and seamless
            </span>
            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
              How Booking Works
            </h2>
            <p className="mt-4 text-base-content/60">
              Four simple steps between your idea and your next creation.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {bookingSteps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="relative text-center">
                  <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon size={34} />

                    <span className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-content">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-bold">
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-base-content/60">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Host Guarantee */}
      <section id="about" className="bg-base-200 px-5 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="font-semibold uppercase tracking-widest text-primary">
                Your creativity comes first
              </span>

              <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">
                Create With Confidence. Every Step of the Way.
              </h2>

              <p className="mt-6 leading-8 text-base-content/60">
                StudioSpace connects creators with inspiring spaces
                while making the entire booking experience simple,
                transparent, and reliable.
              </p>

              <Link
                href="/studios"
                className="btn btn-primary mt-8 rounded-xl"
              >
                Find Your Studio
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {guarantees.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-base-300 bg-base-100 p-6"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon size={25} />
                    </span>

                    <h3 className="mt-5 font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-base-content/60">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Host CTA */}
      <section className="bg-primary px-5 py-16 text-primary-content md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-7 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-3xl font-extrabold md:text-4xl">
              Have a Space Worth Sharing?
            </h2>
            <p className="mt-3 text-primary-content/80">
              Turn your creative space into an opportunity.
            </p>
          </div>

          <Link
            href="/add-studio"
            className="btn rounded-xl border-none bg-white px-7 text-primary hover:bg-white/90"
          >
            Become a Host
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}