"use client";

import Image from "next/image";
import { useRef, useState, DragEvent } from "react";
import { Upload, X, GripVertical, Loader2, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadedImage {
  url: string;
  publicId: string;
  order: number;
}

export default function ImageUploader({
  images,
  onChange,
}: {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      fileArray.forEach((f) => formData.append("files", f));

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error ?? "Upload failed.");
        return;
      }

      const newImages: UploadedImage[] = json.images.map(
        (img: { url: string; publicId: string }, i: number) => ({
          url: img.url,
          publicId: img.publicId,
          order: images.length + i,
        })
      );
      onChange([...images, ...newImages]);

      if (json.errors?.length) {
        setError(json.errors.join(" "));
      }
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(index: number) {
    const target = images[index];
    const next = images.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i }));
    onChange(next);
    try {
      await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: target.publicId }),
      });
    } catch {
      // Local state is already updated; a failed remote cleanup isn't
      // worth blocking the admin's workflow over. It'll be an orphaned
      // Cloudinary asset at worst.
    }
  }

  function handleDropZoneDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) {
      uploadFiles(e.dataTransfer.files);
    }
  }

  // Reordering existing thumbnails via drag-and-drop.
  function handleTileDragStart(index: number) {
    setDraggedIndex(index);
  }
  function handleTileDragOver(e: DragEvent<HTMLDivElement>, index: number) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const next = [...images];
    const [moved] = next.splice(draggedIndex, 1);
    next.splice(index, 0, moved);
    setDraggedIndex(index);
    onChange(next.map((img, i) => ({ ...img, order: i })));
  }
  function handleTileDragEnd() {
    setDraggedIndex(null);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDropZoneDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
          dragOver ? "border-sage-dark bg-sage/5" : "border-line hover:border-sage/50"
        )}
      >
        {uploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-sage-dark" aria-hidden="true" />
        ) : (
          <Upload className="h-6 w-6 text-ink-light" aria-hidden="true" />
        )}
        <p className="font-sans text-sm text-ink">
          {uploading ? "Uploading..." : "Drag & drop images here, or click to browse"}
        </p>
        <p className="font-sans text-xs text-ink-light">JPG, PNG, or WebP, up to 8MB each</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs text-red-500">
          {error}
        </p>
      )}

      {images.length === 0 ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-cream-alt/60 px-4 py-3 text-xs text-ink-light">
          <ImageOff className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          No images yet — at least one is required.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {images.map((img, i) => (
            <div
              key={img.publicId}
              draggable
              onDragStart={() => handleTileDragStart(i)}
              onDragOver={(e) => handleTileDragOver(e, i)}
              onDragEnd={handleTileDragEnd}
              className={cn(
                "group relative aspect-square cursor-grab overflow-hidden rounded-xl border border-line bg-cream-alt active:cursor-grabbing",
                draggedIndex === i && "opacity-50"
              )}
            >
              <Image src={img.url} alt={`Product image ${i + 1}`} fill sizes="120px" className="object-cover" />
              <div className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/30" />
              <span className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[10px] font-medium text-ink">
                {i + 1}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(i)}
                aria-label={`Delete image ${i + 1}`}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <span className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity group-hover:opacity-100">
                <GripVertical className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
