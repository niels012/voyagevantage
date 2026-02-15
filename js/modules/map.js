// js/modules/map.js
import { API_KEYS, BASE_URLS } from './api.js';

/**
 * Generates a static map image URL from Mapbox.
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} - The URL for the static map image.
 */
export function getStaticMapURL(lat, lng) {
    const zoom = 5;      // Zoom level (0-22)
    const width = 600;   // Image width in px
    const height = 300;  // Image height in px
    const bearing = 0;   // Rotation
    const pitch = 0;     // Tilt

    // Mapbox expects coordinates as: longitude,latitude
    return `${BASE_URLS.MAPBOX}/${lng},${lat},${zoom},${bearing},${pitch}/${width}x${height}?access_token=${API_KEYS.MAPBOX_TOKEN}`;
}