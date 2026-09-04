"use client";

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon,
  X,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import api from "@/lib/api";

interface Moment {
  _id: string;
  imageUrl: string;
  caption?: string;
  event?: string;
  published?: boolean;
  createdAt?: string;
}

export default function MomentAdmin() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [event, setEvent] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  /*
   * ---------------------------------------------------------
   * FETCH MOMENTS
   * ---------------------------------------------------------
   */

  const fetchMoments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.get("/moments");

      setMoments(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to fetch moments:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load moments."
      );

      setMoments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoments();
  }, []);

  /*
   * ---------------------------------------------------------
   * SELECT IMAGES
   * ---------------------------------------------------------
   */

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setSelectedFiles(files);
    setMessage("");
    setError("");
  };

  /*
   * ---------------------------------------------------------
   * REMOVE SELECTED IMAGE BEFORE UPLOAD
   * ---------------------------------------------------------
   */

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  /*
   * ---------------------------------------------------------
   * CLEAR FORM
   * ---------------------------------------------------------
   */

  const clearForm = () => {
    setSelectedFiles([]);
    setCaption("");
    setEvent("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /*
   * ---------------------------------------------------------
   * UPLOAD MOMENTS
   * ---------------------------------------------------------
   */

  const handleUpload = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!selectedFiles.length) {
      setError("Please select at least one image.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const formData = new FormData();

      /*
       * IMPORTANT:
       * This must match your Multer field name.
       *
       * If your backend uses:
       * upload.array("images", 20)
       *
       * then "images" is correct.
       */

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      formData.append("caption", caption);
      formData.append("event", event);

      await api.post("/moments", formData, true);

      setMessage(
        selectedFiles.length === 1
          ? "Moment uploaded successfully."
          : `${selectedFiles.length} moments uploaded successfully.`
      );

      clearForm();

      await fetchMoments();
    } catch (err: any) {
      console.error("Moment upload failed:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to upload the moment(s)."
      );
    } finally {
      setUploading(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * DELETE MOMENT
   * ---------------------------------------------------------
   */

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this moment?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      await api.del(`/moments/${id}`, true);

      setMoments((current) =>
        current.filter((moment) => moment._id !== id)
      );

      setMessage("Moment deleted successfully.");
    } catch (err: any) {
      console.error("Failed to delete moment:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete this moment."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /*
   * ---------------------------------------------------------
   * FORMAT DATE
   * ---------------------------------------------------------
   */

  const formatDate = (date?: string) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="min-h-full bg-cloud p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cta-gradient shadow-sm">
                <Camera className="h-5 w-5 text-white" />
              </span>

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-call-blue">
                Media Management
              </span>
            </div>

            <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              Moments Captured
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Upload and manage photos from gatherings, programs,
              conferences, and other community moments.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchMoments}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:border-call-blue/30 hover:text-call-blue disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />

            Refresh
          </button>
        </div>

        {/* ==================================================
            SUCCESS MESSAGE
        ================================================== */}

        {message && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            <span>{message}</span>

            <button
              type="button"
              onClick={() => setMessage("")}
              className="ml-auto"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ==================================================
            ERROR MESSAGE
        ================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="ml-auto"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ==================================================
            UPLOAD CARD
        ================================================== */}

        <div className="mb-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-ink px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Upload className="h-5 w-5 text-white" />
              </div>

              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Add New Moments
                </h2>

                <p className="text-xs text-white/50">
                  Upload one or multiple photos at once
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleUpload}
            className="space-y-6 p-5 sm:p-6"
          >
            {/* IMAGE PICKER */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-ink">
                Photos
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex min-h-40 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center transition hover:border-call-blue/40 hover:bg-call-blue/[0.03]"
              >
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-call-blue/10">
                  <ImageIcon className="h-6 w-6 text-call-blue" />
                </span>

                <span className="text-sm font-semibold text-ink">
                  Click to choose photos
                </span>

                <span className="mt-1 text-xs text-slate-400">
                  JPG, PNG or WebP • Multiple images supported
                </span>
              </button>
            </div>

            {/* SELECTED IMAGE PREVIEWS */}

            {selectedFiles.length > 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">
                    Selected Photos
                  </p>

                  <span className="rounded-full bg-call-blue/10 px-3 py-1 text-xs font-semibold text-call-blue">
                    {selectedFiles.length} selected
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {selectedFiles.map((file, index) => {
                    const previewUrl =
                      URL.createObjectURL(file);

                    return (
                      <div
                        key={`${file.name}-${index}`}
                        className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrl}
                          alt={file.name}
                          className="h-full w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeSelectedFile(index)
                          }
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-red-500"
                          title="Remove image"
                        >
                          <X className="h-4 w-4" />
                        </button>

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 pt-6">
                          <p className="truncate text-[10px] text-white">
                            {file.name}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CAPTION + EVENT */}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="moment-caption"
                  className="mb-2 block text-sm font-semibold text-ink"
                >
                  Caption
                  <span className="ml-1 font-normal text-slate-400">
                    (optional)
                  </span>
                </label>

                <input
                  id="moment-caption"
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. A beautiful worship moment"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-call-blue focus:ring-2 focus:ring-call-blue/10"
                />
              </div>

              <div>
                <label
                  htmlFor="moment-event"
                  className="mb-2 block text-sm font-semibold text-ink"
                >
                  Event
                  <span className="ml-1 font-normal text-slate-400">
                    (optional)
                  </span>
                </label>

                <input
                  id="moment-event"
                  type="text"
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  placeholder="e.g. Youth Conference 2026"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-call-blue focus:ring-2 focus:ring-call-blue/10"
                />
              </div>
            </div>

            {/* ACTIONS */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={clearForm}
                disabled={uploading}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={
                  uploading || selectedFiles.length === 0
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cta-gradient px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload{" "}
                    {selectedFiles.length > 1
                      ? `${selectedFiles.length} Photos`
                      : "Photo"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ==================================================
            EXISTING MOMENTS
        ================================================== */}

        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-call-blue">
                Gallery
              </p>

              <h2 className="mt-1 font-display text-xl font-bold text-ink">
                Uploaded Moments
              </h2>
            </div>

            {!loading && (
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
                {moments.length}{" "}
                {moments.length === 1 ? "moment" : "moments"}
              </span>
            )}
          </div>

          {/* LOADING */}

          {loading && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square animate-pulse rounded-2xl bg-slate-200"
                />
              ))}
            </div>
          )}

          {/* EMPTY */}

          {!loading && moments.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-call-blue/10">
                <Camera className="h-6 w-6 text-call-blue" />
              </div>

              <h3 className="font-display text-lg font-bold text-ink">
                No moments yet
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                Upload photos from your gatherings and programs
                and they will appear here.
              </p>
            </div>
          )}

          {/* MOMENTS */}

          {!loading && moments.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {moments.map((moment) => (
                <article
                  key={moment._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* IMAGE */}

                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={moment.imageUrl}
                      alt={
                        moment.caption ||
                        moment.event ||
                        "Ministry moment"
                      }
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(moment._id)
                      }
                      disabled={
                        deletingId === moment._id
                      }
                      className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-red-500 disabled:opacity-70"
                      title="Delete moment"
                    >
                      {deletingId === moment._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>

                    {/* PUBLISHED STATUS */}

                    {moment.published !== false && (
                      <span className="absolute bottom-2 left-2 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                        Published
                      </span>
                    )}
                  </div>

                  {/* DETAILS */}

                  <div className="p-3">
                    {moment.caption && (
                      <p className="truncate text-sm font-semibold text-ink">
                        {moment.caption}
                      </p>
                    )}

                    {moment.event && (
                      <p className="mt-1 truncate text-xs text-call-blue">
                        {moment.event}
                      </p>
                    )}

                    {moment.createdAt && (
                      <p className="mt-2 text-[10px] text-slate-400">
                        {formatDate(moment.createdAt)}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}