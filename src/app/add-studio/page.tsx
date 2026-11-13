
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, X, Loader2, Plus } from "lucide-react";

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

export default function AddStudioPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    price: "",
    deposit: "",
    capacity: "",
  });

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

    setLoading(true);

    try {
      const tokenResponse = await fetch("/api/auth/token");

      if (!tokenResponse.ok) {
        throw new Error("Please log in to continue");
      }

      const tokenData = await tokenResponse.json();
      const token = tokenData.token;

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/api/studios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
        throw new Error(result.message || "Failed to create studio");
      }

      toast.success("Studio listed successfully!");
      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-base-200 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Become a Host
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">
            List Your Studio
          </h1>
          <p className="mt-3 text-base-content/65">
            Share your creative space with people who need it.
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
                placeholder="e.g. Modern Photography Studio"
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
                placeholder="Describe your studio and what makes it special..."
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
                placeholder="e.g. Dhanmondi, Dhaka"
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
                  placeholder="1500"
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
                  placeholder="500"
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
                  placeholder="10"
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </section>

          <div className="divider" />

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Studio Image</h2>
            <p className="text-sm text-base-content/60">
              Upload one clear studio photo (maximum 5MB).
            </p>

            {image ? (
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
            ) : (
              <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-base-300 bg-base-200/50 p-6 text-center transition hover:border-primary">
                {uploading ? (
                  <Loader2 className="mb-3 animate-spin" size={32} />
                ) : (
                  <Upload className="mb-3 text-primary" size={32} />
                )}
                <span className="font-semibold">
                  {uploading ? "Uploading image..." : "Click to upload image"}
                </span>
                <span className="mt-2 text-sm text-base-content/50">
                  JPG, PNG or WEBP
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            )}
          </section>

          <div className="divider" />

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Amenities</h2>
            <p className="text-sm text-base-content/60">
              Select everything available in your studio.
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

          <button
            type="submit"
            disabled={loading || uploading}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating Listing...
              </>
            ) : (
              <>
                <Plus size={18} />
                Publish Studio
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
