import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

const PUBLIC_ROOT = path.join(process.cwd(), "public");

/**
 * Returns the public-relative path if the file exists in /public,
 * or null if not. Lets pages render a fallback (emoji block, gradient)
 * when Midjourney assets haven't been dropped in yet.
 */
export async function publicAsset(publicRelPath: string): Promise<string | null> {
  const rel = publicRelPath.startsWith("/") ? publicRelPath.slice(1) : publicRelPath;
  const abs = path.join(PUBLIC_ROOT, rel);
  try {
    await fs.access(abs);
    return "/" + rel.replace(/\\/g, "/");
  } catch {
    return null;
  }
}
