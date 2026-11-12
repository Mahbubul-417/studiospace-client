import Link from "next/link";
import { Aperture } from "lucide-react";

const categories = [
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-5 flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content">
                <Aperture size={25} />
              </span>

              <span className="text-xl font-extrabold">
                StudioSpace
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-neutral-content/70">
              Your creative vision deserves the perfect space.
              Discover, connect, and create with StudioSpace.
            </p>

            <div className="mt-6 flex gap-4">
            
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="text-lg font-bold hover:text-primary"
              >
                𝕏
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-bold">Quick Links</h3>
            <ul className="space-y-3 text-sm text-neutral-content/70">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li><Link href="/studios" className="hover:text-primary">Explore Studios</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-primary">How It Works</Link></li>
              <li><Link href="/#about" className="hover:text-primary">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-bold">Studio Categories</h3>
            <ul className="space-y-3 text-sm text-neutral-content/70">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/studios?category=${encodeURIComponent(category)}`}
                    className="hover:text-primary"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-bold">Stay Inspired</h3>
            <p className="mb-4 text-sm leading-6 text-neutral-content/70">
              Get creative space updates and inspiration in your inbox.
            </p>

            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="input w-full border-neutral-content/20 bg-neutral-content/10 text-neutral-content placeholder:text-neutral-content/50"
                required
              />

              <button type="button" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-neutral-content/15 pt-6 text-sm text-neutral-content/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} StudioSpace. All rights reserved.
          </p>

          <div className="flex gap-5">
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}