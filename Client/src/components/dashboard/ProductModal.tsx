import React, { useEffect, useState } from "react";
import {
  X,
  Loader2,
  Package,
  DollarSign,
  Upload,
  Image as ImageIcon,
  FileCheck,
  Globe,
  Lock,
  EyeOff,
} from "lucide-react";
import {
  uploadProductFile,
  uploadProductThumbnail,
} from "@/lib/products";
import { compressImage } from "@/lib/imageCompressor";
import type {
  CreateProductPayload,
  DigitalProduct,
  ProductVisibility,
  UpdateProductPayload,
} from "@/lib/types";

interface Props {
  isOpen: boolean;
  editingProduct: DigitalProduct | null;
  onClose: () => void;
  onSubmit: (payload: CreateProductPayload | UpdateProductPayload) => Promise<DigitalProduct>;
}

export function ProductModal({
  isOpen,
  editingProduct,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [visibility, setVisibility] = useState<ProductVisibility>("PUBLIC");
  const [downloadLimit, setDownloadLimit] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedThumb, setSelectedThumb] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingProduct) {
      setTitle(editingProduct.title || "");
      setDescription(editingProduct.description || "");
      setPrice(String(editingProduct.price || ""));
      setVisibility(editingProduct.visibility || "PUBLIC");
      setDownloadLimit(editingProduct.downloadLimit ? String(editingProduct.downloadLimit) : "");
      setPreviewUrl(editingProduct.previewUrl || "");
    } else {
      setTitle("");
      setDescription("");
      setPrice("");
      setVisibility("PUBLIC");
      setDownloadLimit("");
      setPreviewUrl("");
    }
    setSelectedFile(null);
    setSelectedThumb(null);
    setError(null);
    setUploadStatus(null);
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Product title is required");
      return;
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setError("Please enter a valid price");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload: CreateProductPayload = {
        title: title.trim(),
        description: description.trim() || null,
        price: numPrice,
        visibility,
        previewUrl: previewUrl.trim() || null,
        downloadLimit: downloadLimit ? Number(downloadLimit) : null,
      };

      const product = await onSubmit(payload);

      // Upload file if selected
      if (selectedFile) {
        setUploadStatus("Uploading product asset...");
        await uploadProductFile(product.id, selectedFile);
      }

      // Upload thumbnail if selected
      if (selectedThumb) {
        setUploadStatus("Uploading thumbnail...");
        await uploadProductThumbnail(product.id, selectedThumb);
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
      setUploadStatus(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-nu-purple-soft flex items-center justify-center text-nu-purple">
              <Package className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-nu-charcoal">
              {editingProduct ? "Edit Digital Product" : "New Digital Product"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-nu-muted hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-nu-charcoal uppercase tracking-wider">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Notion Creator OS Template, Ultimate Preset Pack"
              maxLength={150}
              className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-nu-charcoal uppercase tracking-wider">
                Price (INR ₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-nu-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="499"
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-nu-charcoal uppercase tracking-wider">
                Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as ProductVisibility)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-nu-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
              >
                <option value="PUBLIC">Public (Listed on profile)</option>
                <option value="UNLISTED">Unlisted (Link only)</option>
                <option value="PRIVATE">Private (Draft)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-nu-charcoal uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this digital product include? Instructions, features, format..."
              maxLength={5000}
              className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-nu-charcoal uppercase tracking-wider">
                Download Limit (Optional)
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={downloadLimit}
                onChange={(e) => setDownloadLimit(e.target.value)}
                placeholder="e.g. 5 downloads max"
                className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-nu-charcoal uppercase tracking-wider">
                Preview URL (Demo / Video)
              </label>
              <input
                type="url"
                value={previewUrl}
                onChange={(e) => setPreviewUrl(e.target.value)}
                placeholder="https://..."
                className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
              />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-nu-charcoal uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-nu-purple" />
                Product File (Download Asset)
              </label>
              {editingProduct?.fileUrl && (
                <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5" /> File already uploaded: {editingProduct.fileUrl}
                </p>
              )}
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="text-xs text-nu-charcoal file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-nu-purple-soft file:text-nu-purple hover:file:bg-nu-purple-soft-hover cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1 pt-2 border-t border-gray-200/60">
              <label className="text-xs font-bold text-nu-charcoal uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-nu-purple" />
                Thumbnail Image
              </label>
              {editingProduct?.thumbnail && (
                <p className="text-[11px] text-nu-muted truncate">
                  Current: {editingProduct.thumbnail}
                </p>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0] || null;
                  if (!file) {
                    setSelectedThumb(null);
                    return;
                  }
                  try {
                    const compressed = await compressImage(file, { maxDimension: 640, quality: 0.82 });
                    setSelectedThumb(compressed);
                  } catch {
                    setSelectedThumb(file);
                  }
                }}
                className="text-xs text-nu-charcoal file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-nu-purple-soft file:text-nu-purple hover:file:bg-nu-purple-soft-hover cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-200 text-nu-muted hover:text-nu-charcoal font-semibold rounded-full px-5 py-2 text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-nu-purple hover:bg-nu-purple-hover text-white font-semibold rounded-full px-6 py-2 text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {uploadStatus || "Saving..."}
                </>
              ) : editingProduct ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
