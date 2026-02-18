
const STORAGE_KEY = 'voyage_vantage_searches';

export function saveSearch(query) {
    let searches = getSearches();

    searches = searches.filter(item => item.toLowerCase() !== query.toLowerCase());

    searches.unshift(query);

    if (searches.length > 5) searches.pop();
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
}

export function getSearches() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}