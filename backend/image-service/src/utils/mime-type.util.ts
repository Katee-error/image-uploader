
export function resolveContentType(filename: string): string {
    const ext = filename.split(".").pop()?.toLowerCase();
    const mimeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      bmp: "image/bmp",
      svg: "image/svg+xml",
      tiff: "image/tiff",
    };
  
    return mimeMap[ext || ""] || "application/octet-stream";
  }
  