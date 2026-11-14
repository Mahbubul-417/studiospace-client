
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { signOut, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Aperture,
  Menu,
  X,
  Sun,
  Moon,
  User,
  LogOut,
  LayoutDashboard,
  CalendarDays,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/#about" },
];

function subscribe() {
  return () => {};
}

function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const { data: session, isPending } = useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const mounted = useMounted();

  const isLoggedIn = !!session?.user;

  async function handleLogout() {
    try {
      await signOut();

      toast.success("Logged out successfully");
      setMenuOpen(false);
      router.refresh();
    } catch {
      toast.error("Unable to log out. Please try again.");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/95 backdrop-blur-md">
      <nav className="navbar mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="navbar-start">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content">
              <Aperture size={25} />
            </span>

            <span className="text-xl font-extrabold tracking-tight">
              Studio<span className="text-primary">Space</span>
            </span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => {
              const active =
                pathname === link.href ||
                (link.href === "/studios" &&
                  pathname.startsWith("/studios"));

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm font-semibold transition-colors hover:text-primary ${
                      active ? "text-primary" : "text-base-content/70"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="navbar-end gap-2">
          {mounted && (
            <button
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className="btn btn-ghost btn-circle"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>
          )}

          <div className="hidden items-center gap-2 sm:flex">
            {!isPending && (
              isLoggedIn ? (
                <>
                  <Link
                    href="/my-listings"
                    className="btn btn-ghost btn-sm"
                  >
                    My Listings
                  </Link>

                  <Link
                    href="/my-bookings"
                    className="btn btn-ghost btn-sm"
                  >
                    My Bookings
                  </Link>

                  <span className="hidden max-w-28 truncate text-sm font-semibold xl:block">
                    {session.user.name || session.user.email}
                  </span>

                  <button
                    onClick={handleLogout}
                    className="btn btn-outline btn-sm"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn btn-ghost btn-sm">
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="btn btn-primary btn-sm px-5"
                  >
                    Register
                  </Link>
                </>
              )
            )}
          </div>

          <button
            className="btn btn-ghost btn-circle lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-base-300 bg-base-100 px-5 py-5 lg:hidden">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block font-medium hover:text-primary"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {!isPending && (
            <div className="mt-5 flex flex-col gap-3 border-t border-base-300 pt-4">
              {isLoggedIn ? (
                <>
                  <p className="flex items-center gap-2 text-sm font-semibold text-base-content/70">
                    <User size={17} />
                    {session.user.name || session.user.email}
                  </p>

                  <Link
                    href="/my-listings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 font-medium"
                  >
                    <LayoutDashboard size={18} />
                    My Listings
                  </Link>

                  <Link
                    href="/my-bookings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 font-medium"
                  >
                    <CalendarDays size={18} />
                    My Bookings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="btn btn-outline w-full"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="btn btn-outline flex-1"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="btn btn-primary flex-1"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
