// js/main.js
import { getCountryData, getNewsData, getCurrencyData } from './modules/api.js';
import { renderDashboard, showLoading, hideLoading, showError } from './modules/ui.js';
import { saveSearch, getSearches } from './modules/storage.js';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const recentList = document.getElementById('recent-list');
const recentSection = document.getElementById('recent-searches');

// Event Listener: Form Submit
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        await handleSearch(query);
    }
});

// Main Search Logic
async function handleSearch(query) {
    showLoading();
    try {
        // 1. Fetch Country Data
        // Note: The RestCountries API is best searched by 'Country Name'. 
        // If the user types 'Paris', this API might fail. 
        // For this demo, we assume the user types a Country (e.g., 'France') or we rely on partial matching.
        const countryData = await getCountryData(query);
        
        if (!countryData || countryData.status === 404) {
            throw new Error('Destination not found. Please try a country name.');
        }

        const countryCode = countryData[0].cca2; // e.g., 'JP' for Japan
        const countryName = countryData[0].name.common;

        // 2. Fetch News & Currency in parallel
        const [newsData, currencyData] = await Promise.all([
            getNewsData(query, countryName), // CHANGED: Pass 'query' first!
            getCurrencyData()
        ]);

        // 3. Render UI
        renderDashboard(countryData, newsData, currencyData);

        // 4. Save to History
        saveSearch(query);
        renderRecentSearches();

    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Render Recent Searches from LocalStorage

function toSentenceCase(str) {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

function renderRecentSearches() {
    const searches = getSearches();
    if (searches.length > 0) {
        recentSection.classList.remove('hidden');
        recentList.innerHTML = '';
        const template = document.getElementById('recent-search-template');
        
        searches.forEach(term => {
            const clone = template.content.cloneNode(true);
            const btn = clone.querySelector('button');
            
            // CHANGED: Apply the formatting here
            btn.textContent = toSentenceCase(term);
            
            btn.onclick = () => {
                // We keep the original term for the search logic, 
                // but update the input to look nice too.
                const prettyTerm = toSentenceCase(term);
                searchInput.value = prettyTerm;
                handleSearch(term);
            };
            recentList.appendChild(clone);
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderRecentSearches();
});