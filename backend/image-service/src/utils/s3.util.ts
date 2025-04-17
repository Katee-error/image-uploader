import { NotFoundException } from "@nestjs/common";

export function extractS3KeyFromUrl(url: string, baseDir: string): string {
  const urlParts = new URL(url);
  const pathParts = urlParts.pathname.split("/");
  const index = pathParts.indexOf(baseDir);
  if (index === -1)
    throw new Error(`Base directory "${baseDir}" not found in URL`);
  return pathParts.slice(index).join("/");
}
export async function fetchImageFromS3(
  getSignedUrl: (key: string) => Promise<string>,
  key: string,
  label: string
): Promise<Buffer> {
  try {
    const signedUrl = await getSignedUrl(key);
    const response = await fetch(signedUrl);

    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error: unknown) {
    const message = (error as Error).message || "Unknown fetch error";
    console.error(`Error fetching ${label} image from S3: ${message}`);
    throw new NotFoundException(`Failed to fetch ${label} image: ${message}`);
  }
}
