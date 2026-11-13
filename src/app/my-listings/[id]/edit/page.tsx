
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Upload, X, Save } from "lucide-react";

const API_URL = "http://localhost:5000";

const categories = [
  "Photography",
  "Videography",
  "Podcast",
  "Music",
  "Event",
  "Other",
];

const availableAmenities = [
  "Natural Lighting",
  "Air Conditioning",
  "Wi-Fi",
  "Parking",
  "Soundproofing",
  "Lighting Equipment",
  "Backdrop",
  "Restroom",
  "Kitchen",
  "Power Backup",
];

interface Studio {
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

export default function EditStudioPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const studioId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    price: "",
    deposit: "",
    capacity: "",
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const fetchStudio = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/studios/${studioId}`, {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load studio");
      }

      const studio: Studio = result.data;

      setForm({
        title: studio.title,
        category: studio.category,
        description: studio.description,
        location: studio.location,
        price: String(studio.price),
        deposit: String(studio.deposit),
        capacity: String(studio.capacity),
      });

      setImage(studio.image);
      setSelectedAmenities(studio.amenities || []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load studio"
      );
    } finally {
      setLoading(false);
    }
  }, [studioId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudio();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchStudio]);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function toggleAmenity(amenity: string) {
    setSelectedAmenities((previous) =>
      previous.includes(amenity)
        ? previous.filter((item) => item !== amenity)
        : [...previous, amenity]
    );
  }

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      toast.error("ImgBB API key is missing");
      return;
    }

    setUploading(true);

    try {
      const imageData = new FormData();
      imageData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: imageData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Image upload failed");
      }

      setImage(result.data.url);
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!image) {
      toast.error("Please upload a studio image");
      return;
    }

    if (selectedAmenities.length === 0) {
      toast.error("Please select at least one amenity");
      return;
    }

    const price = Number(form.price);
    const deposit = Number(form.deposit);
    const capacity = Number(form.capacity);

    if (
      !Number.isFinite(price) ||
      !Number.isFinite(deposit) ||
      !Number.isInteger(capacity) ||
      price <= 0 ||
      deposit < 0 ||
      capacity <= 0
    ) {
      toast.error("Please enter valid price, deposit, and capacity");
      return;
    }

    setSaving(true);

    try {
      const tokenResponse = await fetch("/api/auth/token");

      if (!tokenResponse.ok) {
        throw new Error("Please log in to continue");
      }

      const tokenData = await tokenResponse.json();

      if (!tokenData.token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/api/studios/${studioId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({
          ...form,
          price,
          deposit,
          capacity,
          image,
          amenities: selectedAmenities,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update studio");
      }

      toast.success("Studio updated successfully!");
      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
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
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Host Dashboard
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">Edit Studio</h1>
          <p className="mt-3 text-base-content/65">
            Update your studio information and availability details.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm md:p-8"
        >
          <section className="space-y-5">
            <h2 className="text-xl font-semibold">Studio Information</h2>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Studio Name *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                maxLength={100}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="select select-bordered w-full"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                minLength={20}
                maxLength={2000}
                rows={5}
                className="textarea textarea-bordered w-full"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Location *
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
            </div>
          </section>

          <div className="divider" />

          <section className="space-y-5">
            <h2 className="text-xl font-semibold">Pricing and Capacity</h2>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Price per hour (৳) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="1"
                  required
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Deposit (৳) *
                </label>
                <input
                  type="number"
                  name="deposit"
                  value={form.deposit}
                  onChange={handleChange}
                  min="0"
                  required
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Capacity *
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  required
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </section>

          <div className="divider" />

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Studio Image</h2>

            {image && (
              <div className="relative max-w-md overflow-hidden rounded-xl border border-base-300">
                <img
                  src={image}
                  alt="Studio preview"
                  className="h-64 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImage("")}
                  className="btn btn-circle btn-sm absolute right-3 top-3"
                  aria-label="Remove image"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-base-300 bg-base-200/50 p-6 text-center transition hover:border-primary">
              {uploading ? (
                <Loader2 className="mb-3 animate-spin" size={30} />
              ) : (
                <Upload className="mb-3 text-primary" size={30} />
              )}
              <span className="font-semibold">
                {uploading ? "Uploading image..." : "Upload a new image"}
              </span>
              <span className="mt-2 text-sm text-base-content/50">
                JPG, PNG or WEBP (maximum 5MB)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </section>

          <div className="divider" />

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Amenities</h2>
            <p className="text-sm text-base-content/60">
              Select all amenities available in your studio.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {availableAmenities.map((amenity) => (
                <label
                  key={amenity}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-base-300 p-3 transition hover:border-primary"
                >
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="checkbox checkbox-primary checkbox-sm"
                  />
                  <span className="text-sm">{amenity}</span>
                </label>
              ))}
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/my-listings")}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || uploading}
              className="btn btn-primary flex-1"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
