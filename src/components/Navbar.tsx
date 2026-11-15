
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
  ClipboardList,
  ChevronDown,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/#about" },
];

function subscribe() {
  return () => { };
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
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Unable to log out. Please try again.");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/95 backdrop-blur-md">
      <nav className="navbar mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="navbar-start">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content">
              <Aperture size={25} />
            </span>

            <span className="text-lg font-extrabold tracking-tight sm:text-xl">
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
                    className={`text-sm font-semibold transition-colors hover:text-primary ${active
                      ? "text-primary"
                      : "text-base-content/70"
                      }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="navbar-end gap-1 sm:gap-2">
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

          {!isPending &&
            (isLoggedIn ? (
              <div className="dropdown dropdown-end">
                <button
                  tabIndex={0}
                  className="btn btn-ghost h-auto min-h-12 gap-2 px-2 normal-case"
                  aria-label="Open profile menu"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User size={20} />
                    </span>
                  )}

                  <span className="max-w-16 truncate text-sm font-semibold sm:max-w-32">
                    {session.user.name || session.user.email}
                  </span>

                  <ChevronDown size={16} className="text-base-content/60" />
                </button>

                <ul
                  tabIndex={0}
                  className="menu dropdown-content z-[60] mt-3 w-60 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
                >
                  <li className="menu-title">
                    <span>My Account</span>
                  </li>

                  <li>
                    <Link href="/my-listings">
                      <LayoutDashboard size={18} />
                      My Listings
                    </Link>
                  </li>

                  <li>
                    <Link href="/my-bookings">
                      <CalendarDays size={18} />
                      My Bookings
                    </Link>
                  </li>

                  <li>
                    <Link href="/host-bookings">
                      <ClipboardList size={18} />
                      Booking Requests
                    </Link>
                  </li>

                  <div className="my-1 border-t border-base-300" />

                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-error"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link href="/login" className="btn btn-ghost btn-sm">
                  Login
                </Link>

                <Link
                  href="/register"
                  className="btn btn-primary btn-sm px-5"
                >
                  Register
                </Link>
              </div>
            ))}

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

          {!isPending && !isLoggedIn && (
            <div className="mt-5 flex gap-3 border-t border-base-300 pt-4">
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
    </header>
  );
}
