"use client";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AppShell } from "../components/layout/AppShell";
import { ProductButton } from "../components/product/ProductButton";
import { ProductField } from "../components/product/ProductField";
import { ProductShell } from "../components/product/ProductShell";
import { authService, AuthError } from "../services/authService";
import { analytics } from "../utils/analytics";

// Use same API base as authService (without /api suffix since we add it in endpoint)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Failed to read image file"));
    };
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

export default function ProductNewPage() {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState({
    name: "",
    price: "",
    category: "General",
    stock: "0",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client-side auth check
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(formRef.current!);
    const name = formData.get("name")?.toString().trim() || "";
    const priceStr = formData.get("price")?.toString() || "";
    const price = Number(priceStr);
    const category = formData.get("category")?.toString().trim() || "General";
    const stock = Math.max(0, Number(formData.get("stock") || 0));
    const description = formData.get("description")?.toString().trim() || "";
    const imageFile = formData.get("image");
    let imageUrl = "";

    if (!name) {
      setError("Name is required");
      setIsSubmitting(false);
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError("Price must be a valid number >= 0");
      setIsSubmitting(false);
      return;
    }

    if (imageFile instanceof File && imageFile.size > 0) {
      if (!imageFile.type.startsWith("image/")) {
        setError("Please upload a valid image file");
        setIsSubmitting(false);
        return;
      }
      const maxImageSize = 2 * 1024 * 1024;
      if (imageFile.size > maxImageSize) {
        setError("Image must be 2MB or smaller");
        setIsSubmitting(false);
        return;
      }
      imageUrl = await readFileAsDataUrl(imageFile);
    }

    const payload = {
      name,
      price,
      category,
      stock,
      description,
      imageUrl,
    };

    try {
      const response = await authService.fetchWithToken(`${API_BASE_URL}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText || "Failed to create product");
        setIsSubmitting(false);
        return;
      }
      analytics.trackCreateProduct(name, price, category);
      navigate("/products");
    } catch (error) {
      if (error instanceof AuthError && error.statusCode === 401) {
        navigate("/login");
        return;
      }
      const errorMsg = error instanceof Error ? error.message : "Unable to save product at this time";
      analytics.trackError("Create Product Error", errorMsg);
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell title="Add New Product">
      <ProductShell
        title="Add New Product"
        subtitle="Fill in the product details below to add a new item to your Check-it-Out! catalog."
        footer={
          <>
            Need the catalog instead?{" "}
            <Link to="/products" className="font-bold text-(--primary-strong) underline-offset-4 hover:underline">
              Go to Product List
            </Link>
          </>
        }
      >
        {error ? (
          <p className="mb-4 rounded-lg bg-[#fde8e8] px-3 py-2 text-(--danger)">
            {error}
          </p>
        ) : null}

        <form ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data" className="grid gap-4 sm:grid-cols-2">
          <ProductField
            label="Name"
            name="name"
            required
            value={values.name}
            onChange={handleChange}
          />
          <ProductField
            label="Price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            value={values.price}
            onChange={handleChange}
          />
          <ProductField
            label="Category"
            name="category"
            value={values.category}
            onChange={handleChange}
          />
          <ProductField
            label="Stock"
            name="stock"
            type="number"
            min="0"
            value={values.stock}
            onChange={handleChange}
          />
          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className="font-semibold text-(--text)">Product Image</span>
            <input
              name="image"
              type="file"
              accept="image/*"
              className="rounded-lg border border-dashed border-(--line) bg-[#f8fbfb] px-3 py-2.5 outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-[#edf7f6] file:px-3 file:py-2 file:font-semibold file:text-(--primary-strong)"
            />
          </label>
          <ProductField
            label="Description"
            name="description"
            textarea
            rows={4}
            value={values.description}
            onChange={handleChange}
            className="sm:col-span-2"
          />
          <div className="sm:col-span-2">
            <ProductButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add to Catalog"}
            </ProductButton>
          </div>
        </form>
      </ProductShell>
    </AppShell>
  );
}