// js/modules/api.js


export const API_KEYS = {
    NEWS_API: 'YOUR_NEWS_API_KEY_HERE',
    // ADD: Get this from account.mapbox.com
    MAPBOX_TOKEN: 'YOUR_MAPBOX_ACCESS_TOKEN_HERE' 
};

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
export async function getNewsData(countryCode) {
    // 'q' can be the country name or we can use 'language=en'
    const url = `${BASE_URLS.NEWS}?q=${countryCode}&sortBy=publishedAt&apiKey=${API_KEYS.NEWS_API}&pageSize=5`;
    return await fetchData(url);
}

// 3. Get Currency Data
export async function getCurrencyData() {
    return await fetchData(BASE_URLS.CURRENCY);
}