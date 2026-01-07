/**
 * Get the full URL for a static asset
 * Strips the /api suffix from VITE_API_URL if present, as static assets
 * are served from the root.
 */
export function getAssetUrl(path: string | null | undefined): string {
    if (!path) return "/placeholder-campaign.jpg";
    if (path.startsWith("http")) return path;

    // Get base URL and strip trailing /api if present
    let baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    if (baseUrl.endsWith("/api")) {
        baseUrl = baseUrl.slice(0, -4);
    }

    // Ensure path starts with /
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    return `${baseUrl}${cleanPath}`;
}
