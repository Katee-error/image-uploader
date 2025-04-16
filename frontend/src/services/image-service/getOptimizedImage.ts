import { imageApi } from "@/api";

export const getOptimizedImage = async (imageId: string) => {
  const timestamp = Date.now();

  try {
    const response = await imageApi.get(`/${imageId}/optimized`, {
      responseType: "blob",
      params: { cacheBust: timestamp },
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    if (window._imageUrlCache && window._imageUrlCache[imageId]) {
      URL.revokeObjectURL(window._imageUrlCache[imageId]);
    }

    if (!window._imageUrlCache) {
      window._imageUrlCache = {};
    }

    const blob = new Blob([response.data], {
      type: response.headers["content-type"] || "image/webp",
    });

    const url = URL.createObjectURL(blob);

    window._imageUrlCache[imageId] = url;

    return url;
  } catch (error) {
    console.error(
      `[✘] Error fetching optimized image for ID: ${imageId}:`,
      error
    );
    throw error;
  }
};

declare global {
  interface Window {
    _imageUrlCache?: Record<string, string>;
  }
}
