import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import multer from "multer";
import { ApiError } from "../../utils/ApiError.js";

const storageRoot = path.resolve(process.cwd(), "storage");
const privateRoot = path.join(storageRoot, "private");
const publicRoot = path.join(storageRoot, "public");
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024, files: 1 },
});

class StorageService {
  async save(file, visibility = "private") {
    if (!file) throw new ApiError(400, "File is required");
    const extension = path
      .extname(file.originalname || "")
      .replace(/[^.a-zA-Z0-9]/g, "")
      .slice(0, 12);
    const key = `${visibility}/${crypto.randomUUID()}${extension}`;
    const root = visibility === "public" ? publicRoot : privateRoot;
    await fs.mkdir(root, { recursive: true });
    await fs.writeFile(path.join(storageRoot, key), file.buffer);
    return {
      key,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      provider: "LOCAL",
    };
  }
  async openPrivate(key) {
    if (!key || !key.startsWith("private/"))
      throw new ApiError(404, "Download file not found");
    const resolved = path.resolve(storageRoot, key);
    if (!resolved.startsWith(`${privateRoot}${path.sep}`))
      throw new ApiError(400, "Invalid file path");
    try {
      return await fs.readFile(resolved);
    } catch {
      throw new ApiError(404, "Download file not found");
    }
  }
}
export default new StorageService();
