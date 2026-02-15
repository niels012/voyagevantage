// js/modules/map.js

/**
 * Generates an OpenStreetMap Iframe for the given location.
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} - HTML string for the iframe
 */
export function getMapHTML(lat, lng) {
    // We need to create a "Bounding Box" (bbox) for the map view.
    // This determines how much area is shown around the center point.
    const offset = 0.5; // Larger number = Zoomed Out, Smaller = Zoomed In
    const bbox = [
        lng - offset, // Left (West)
        lat - offset, // Bottom (South)
        lng + offset, // Right (East)
        lat + offset  // Top (North)
    ].join(',');

    return `
        <iframe 
            width="100%" 
            height="300" 
            src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}" 
            style="border: 1px solid black">
        </iframe>
        <br/>
        <small>
            <a href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=10/${lat}/${lng}" target="_blank">
                View Larger Map
            </a>
        </small>
    `;
}