import React, { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Edit2,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  DollarSign,
  FileCheck,
  FileX,
  Upload,
  Globe,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getMyProducts,
  createProduct,
  updateProduct,
  publishProduct,
  unpublishProduct,
  archiveProduct,
} from "@/lib/products";
import { getCachedData, setCachedData } from "@/lib/cache";
import { ProductModal } from "./ProductModal";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import type {
  CreateProductPayload,
  DigitalProduct,
  UpdateProductPayload,
} from "@/lib/types";

const CACHE_KEY = "creator_products";

export function ProductsSection() {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const [products, setProducts] = useState<DigitalProduct[]>(() => {
    return getCachedData<DigitalProduct[]>(CACHE_KEY) || [];
  });
  const [loading, setLoading] = useState(() => !getCachedData<DigitalProduct[]>(CACHE_KEY));
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DigitalProduct | null>(null);

  const username = user?.creatorProfile?.username;

  const loadProducts = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await getMyProducts();
      setProducts(data);
      setCachedData(CACHE_KEY, data);
    } catch (err) {
      if (products.length === 0) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(products.length > 0);
  }, []);

  const handleCreate = async (payload: CreateProductPayload | UpdateProductPayload) => {
    const created = await createProduct(payload as CreateProductPayload);
    setProducts((prev) => {
      const next = [created, ...prev];
      setCachedData(CACHE_KEY, next);
      return next;
    });
    success("Product created!");
    return created;
  };

  const handleUpdate = async (payload: CreateProductPayload | UpdateProductPayload) => {
    if (!editingProduct) throw new Error("No product being edited");
    const updated = await updateProduct(editingProduct.id, payload as UpdateProductPayload);
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === updated.id ? updated : p));
      setCachedData(CACHE_KEY, next);
      return next;
    });
    success("Product updated!");
    return updated;
  };

  const handleTogglePublish = async (product: DigitalProduct) => {
    try {
      if (product.status === "PUBLISHED") {
        const updated = await unpublishProduct(product.id);
        setProducts((prev) => {
          const next = prev.map((p) => (p.id === updated.id ? updated : p));
          setCachedData(CACHE_KEY, next);
          return next;
        });
        success("Product unpublished (draft)");
      } else {
        if (!product.fileUrl) {
          toastError("Please upload a file before publishing this product");
          return;
        }
        const updated = await publishProduct(product.id);
        setProducts((prev) => {
          const next = prev.map((p) => (p.id === updated.id ? updated : p));
          setCachedData(CACHE_KEY, next);
          return next;
        });
        success("Product published!");
      }
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to change publish status");
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm("Are you sure you want to archive this product?")) return;
    try {
      const archived = await archiveProduct(id);
      setProducts((prev) => {
        const next = prev.map((p) => (p.id === archived.id ? archived : p));
        setCachedData(CACHE_KEY, next);
        return next;
      });
      success("Product archived");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to archive product");
    }
  };

  const openCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEdit = (product: DigitalProduct) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-bold text-nu-charcoal">Digital Products</h2>
          <p className="text-xs text-nu-muted">
            Sell templates, ebooks, design assets, presets & downloads directly to your fans
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => void loadProducts()}
            disabled={loading}
            className="p-2 rounded-full hover:bg-gray-100 text-nu-muted hover:text-nu-charcoal transition-all disabled:opacity-50"
            title="Refresh products"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-nu-purple hover:bg-nu-purple-hover text-white font-semibold rounded-full px-5 py-2.5 text-sm transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-56 bg-white rounded-3xl border border-gray-100 animate-pulse p-6"
            />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700">Failed to load products</p>
            <p className="text-xs text-red-500 mt-0.5">{error}</p>
          </div>
          <button onClick={() => void loadProducts()} className="text-xs font-semibold text-red-600 underline">
            Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-nu-purple-soft rounded-2xl flex items-center justify-center">
            <Package className="w-8 h-8 text-nu-purple" />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-nu-charcoal">No digital products yet</p>
            <p className="text-sm text-nu-muted mt-1 max-w-sm">
              Upload templates, guides, or files and start monetizing your digital creations.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-nu-purple hover:bg-nu-purple-hover text-white font-semibold rounded-full px-5 py-2.5 text-sm transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            Create your first product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => {
            const isPublished = product.status === "PUBLISHED";
            const isArchived = product.status === "ARCHIVED";

            return (
              <div
                key={product.id}
                className={`bg-white rounded-3xl border ${
                  isArchived ? "opacity-60 border-gray-200" : "border-gray-100"
                } p-5 shadow-sm hover:shadow-nu-card transition-all flex flex-col justify-between`}
              >
                <div>
                  {/* Thumbnail / Header */}
                  <div className="h-32 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative mb-4 flex items-center justify-center">
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-10 h-10 text-gray-300" />
                    )}

                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 flex-wrap">
                      {product.visibility && (
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            product.visibility === "PUBLIC"
                              ? "bg-blue-600/90 text-white"
                              : product.visibility === "UNLISTED"
                              ? "bg-amber-600/90 text-white"
                              : "bg-slate-700/90 text-white"
                          }`}
                        >
                          {product.visibility === "PUBLIC" ? (
                            <Globe className="w-2.5 h-2.5" />
                          ) : product.visibility === "UNLISTED" ? (
                            <EyeOff className="w-2.5 h-2.5" />
                          ) : (
                            <Lock className="w-2.5 h-2.5" />
                          )}
                          <span>{product.visibility}</span>
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isPublished
                            ? "bg-emerald-500 text-white shadow-xs"
                            : isArchived
                            ? "bg-gray-500 text-white"
                            : "bg-amber-400 text-amber-950"
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-nu-charcoal line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-lg font-extrabold text-nu-purple mt-0.5">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {product.description && (
                    <p className="text-xs text-nu-muted mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-3 text-[11px] text-nu-muted">
                    {product.fileUrl ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <FileCheck className="w-3.5 h-3.5" /> Asset attached
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600 font-semibold">
                        <FileX className="w-3.5 h-3.5" /> No file uploaded
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(product)}
                      className="p-2 rounded-xl hover:bg-gray-100 text-nu-muted hover:text-nu-charcoal transition-colors"
                      title="Edit product & upload files"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {!isArchived && (
                      <button
                        onClick={() => handleTogglePublish(product)}
                        className={`p-2 rounded-xl transition-colors ${
                          isPublished
                            ? "hover:bg-amber-50 text-emerald-600 hover:text-amber-600"
                            : "hover:bg-emerald-50 text-gray-400 hover:text-emerald-600"
                        }`}
                        title={isPublished ? "Unpublish product" : "Publish product"}
                      >
                        {isPublished ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                    )}
                    {!isArchived && (
                      <button
                        onClick={() => handleArchive(product.id)}
                        className="p-2 rounded-xl hover:bg-red-50 text-nu-muted hover:text-red-500 transition-colors"
                        title="Archive product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {username && isPublished && (
                    <Link
                      to={`/${username}/products/${product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-nu-purple hover:underline"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        editingProduct={editingProduct}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingProduct ? handleUpdate : handleCreate}
      />
    </div>
  );
}
