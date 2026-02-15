// js/modules/storage.js

const STORAGE_KEY = 'voyage_vantage_searches';

export function saveSearch(query) {
    let searches = getSearches();
    
    // Remove if duplicate to push to top
    searches = searches.filter(item => item.toLowerCase() !== query.toLowerCase());
    
    // Add to beginning
    searches.unshift(query);
    
    // Keep only last 5
    if (searches.length > 5) searches.pop();
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
}

export function getSearches() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}