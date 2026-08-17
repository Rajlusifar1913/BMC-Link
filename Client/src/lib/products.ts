import { apiDelete, apiFetch, apiGet, apiPatch, apiPost } from "./api";
import type {
  CreateProductPayload,
  DigitalProduct,
  UpdateProductPayload,
} from "./types";

const PRODUCTS = "/api/v1/products";

/**
 * GET /api/v1/products/
 * Creator: list own digital products.
 */
export function getMyProducts(): Promise<DigitalProduct[]> {
  return apiGet<DigitalProduct[]>(`${PRODUCTS}/`);
}

/**
 * POST /api/v1/products/
 * Creator: create a new digital product.
 */
export function createProduct(
  payload: CreateProductPayload
): Promise<DigitalProduct> {
  return apiPost<DigitalProduct>(`${PRODUCTS}/`, payload);
}

/**
 * PATCH /api/v1/products/:id
 * Creator: update digital product metadata.
 */
export function updateProduct(
  id: string,
  payload: UpdateProductPayload
): Promise<DigitalProduct> {
  return apiPatch<DigitalProduct>(`${PRODUCTS}/${id}`, payload);
}

/**
 * POST /api/v1/products/:id/publish
 * Creator: publish a product.
 */
export function publishProduct(id: string): Promise<DigitalProduct> {
  return apiPost<DigitalProduct>(`${PRODUCTS}/${id}/publish`);
}

/**
 * POST /api/v1/products/:id/unpublish
 * Creator: unpublish a product.
 */
export function unpublishProduct(id: string): Promise<DigitalProduct> {
  return apiPost<DigitalProduct>(`${PRODUCTS}/${id}/unpublish`);
}

/**
 * DELETE /api/v1/products/:id
 * Creator: archive a product.
 */
export function archiveProduct(id: string): Promise<DigitalProduct> {
  return apiDelete<DigitalProduct>(`${PRODUCTS}/${id}`);
}

/**
 * POST /api/v1/products/:id/file
 * Creator: upload the downloadable digital product asset.
 */
export function uploadProductFile(
  id: string,
  file: File
): Promise<DigitalProduct> {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch<DigitalProduct>(`${PRODUCTS}/${id}/file`, {
    method: "POST",
    body: formData,
  });
}

/**
 * POST /api/v1/products/:id/thumbnail
 * Creator: upload product thumbnail image.
 */
export function uploadProductThumbnail(
  id: string,
  file: File
): Promise<DigitalProduct> {
  const formData = new FormData();
  formData.append("thumbnail", file);
  return apiFetch<DigitalProduct>(`${PRODUCTS}/${id}/thumbnail`, {
    method: "POST",
    body: formData,
  });
}

/**
 * GET /api/v1/products/public/:username
 * Public: list published products for a creator.
 */
export function getPublicProducts(
  username: string
): Promise<DigitalProduct[]> {
  return apiGet<DigitalProduct[]>(
    `${PRODUCTS}/public/${encodeURIComponent(username)}`
  );
}

/**
 * GET /api/v1/products/public/:username/:slug
 * Public: get a single published product by slug.
 */
export function getPublicProduct(
  username: string,
  slug: string
): Promise<DigitalProduct> {
  return apiGet<DigitalProduct>(
    `${PRODUCTS}/public/${encodeURIComponent(username)}/${encodeURIComponent(
      slug
    )}`
  );
}
