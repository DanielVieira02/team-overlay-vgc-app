/**
 * Utility functions for URL handling in the VGC overlay app
 */

/**
 * Extracts pokepaste ID from various pokepaste URL formats
 * @param teamUrl - The pokepaste URL (e.g., "https://pokepast.es/abc123")
 * @returns The pokepaste ID or empty string if not found
 */
export function extractPokepasteId(teamUrl: string): string {
  try {
    const url = new URL(teamUrl);

    // Handle pokepast.es URLs
    if (url.hostname === "pokepast.es") {
      const pathSegments = url.pathname.split("/").filter(Boolean);
      return pathSegments[0] || "";
    }

    // Handle other formats - just get the last path segment
    const pathSegments = url.pathname.split("/").filter(Boolean);
    return pathSegments[pathSegments.length - 1] || "";
  } catch (error) {
    // If URL parsing fails, try to extract ID from string
    const segments = teamUrl.split("/").filter(Boolean);
    return segments[segments.length - 1] || "";
  }
}

/**
 * Converts a pokepaste URL to the app's teamlist route URL
 * @param teamUrl - The original pokepaste URL
 * @param baseUrl - The app's base URL (defaults to current origin)
 * @returns The app route URL for the team preview
 */
export function convertToTeamlistUrl(
  teamUrl: string,
  baseUrl?: string,
): string {
  const pokepasteId = extractPokepasteId(teamUrl);
  const origin =
    baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  return `${origin}/teamlist/${pokepasteId}`;
}
