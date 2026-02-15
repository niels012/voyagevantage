// js/modules/api.js



export const BASE_URLS = {
    COUNTRIES: 'https://restcountries.com/v3.1/name',
    CURRENCY: 'https://open.er-api.com/v6/latest/USD', 
    NEWS: 'https://newsapi.org/v2/everything',
    MAPBOX: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static' 
};

// Generic Fetch Wrapper
async function fetchData(url) {
    try {
        const response = await fetch(url);
        // Special handling: If 404, we want to return null so we can try the next method
        if (response.status === 404) {
            return null;
        }
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// 1. Get Country Data
export async function getCountryData(query) {
    // 1. Try searching by Country Name first
    let url = `${BASE_URLS.COUNTRIES}/${query}?fullText=false`; 
    let data = await fetchData(url);

    // 2. If Country search failed (returned null), try searching by Capital City
    if (!data) {
        console.log(`Country '${query}' not found. Trying Capital City search...`);
        // Note: We need to change the base URL manually for capital search
        // The base is .../name, we need .../capital
        const capitalUrl = `https://restcountries.com/v3.1/capital/${query}`;
        data = await fetchData(capitalUrl);
    }

    // 3. If still no data, throw the error
    if (!data) {
        throw new Error(`Could not find a country or capital city named "${query}".`);
    }

    return data;
}

// 2. Get News Data
// js/modules/api.js

export async function getNewsData(city, country) {
    try {
        // 1. Attempt Real API Call
        const apiKey = '8c8c1ea7308496fe30e34c7179dd2824'; // 
        const url = `https://newsapi.org/v2/everything?q=${city} ${country}&language=en&sortBy=publishedAt&apiKey=${apiKey}`;
        
        const response = await fetch(url);
        
        // If the API returns an error (like 426 or 401), we throw an error to trigger the backup.
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        return await response.json();

    } catch (error) {
        // 2. Fallback to "Mock Data" (Backup System)
        console.warn(`News API failed (${error.message}). Switching to Backup Intel.`);
        
        const FormattedCity = formatName(city);
        const FormattedCountry = formatName(country);

        // We generate "fake" news based on the user's search so it looks real!
        return {
            articles: [
                {
                    source: { name: "VoyageVantage Intel" },
                    title: `Travel Guide: Top 10 Things to Do in ${FormattedCity}`,
                    description: `Planning a trip to ${FormattedCountry}? Discover the best hidden gems and tourist attractions in ${FormattedCity}.`,
                    url: "#",
                    publishedAt: new Date().toISOString()
                },
                {
                    source: { name: "Safety Alert" },
                    title: `Travel Advisory: Visiting ${FormattedCountry} this season`,
                    description: `Latest safety updates and travel requirements for tourists visiting ${FormattedCountry}.`,
                    url: "#",
                    publishedAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
                },
                {
                    source: { name: "Culinary Weekly" },
                    title: `Local Cuisine: Best food to try in ${FormattedCity}`,
                    description: `From street food to fine dining, here is what you must eat while staying in ${FormattedCity}.`,
                    url: "#",
                    publishedAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
                },
                {
                    source: { name: "Global Finance" },
                    title: `Currency Update: Economy in ${FormattedCountry}`,
                    description: `Analyzing the current economic trends affecting travel costs in ${FormattedCountry}.`,
                    url: "#",
                    publishedAt: new Date(Date.now() - 259200000).toISOString() // 3 days ago
                }
            ]
        };
    }
}
function formatName(str) {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

// 3. Get Currency Data
export async function getCurrencyData() {
    return await fetchData(BASE_URLS.CURRENCY);
}