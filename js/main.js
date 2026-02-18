// js/main.js
import { getCountryData, getNewsData, getCurrencyData } from './modules/api.js';
import { renderDashboard, showLoading, hideLoading, showError } from './modules/ui.js';
import { saveSearch, getSearches } from './modules/storage.js';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const recentList = document.getElementById('recent-list');
const recentSection = document.getElementById('recent-searches');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        await handleSearch(query);
    }
});


async function handleSearch(query) {
    showLoading();
    try {
        const countryData = await getCountryData(query);
        
        if (!countryData || countryData.status === 404) {
            throw new Error('Destination not found. Please try a country name.');
        }

        const countryCode = countryData[0].cca2; 
        const countryName = countryData[0].name.common;
        let newsData = { articles: [] }; 
        let currencyData = null;

        try {
            newsData = await getNewsData(query, countryName);
        } catch (error) {
            console.warn("News API failed (likely CORS or Plan restriction):", error);
        }

        try {
            currencyData = await getCurrencyData();
        } catch (error) {
            console.warn("Currency API failed:", error);
        }

        renderDashboard(countryData, newsData, currencyData);


        saveSearch(query);
        renderRecentSearches();

    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
    let newsData = { articles: [] };

        try {
            newsData = await getNewsData(query, countryName);
        } catch (error) {
            console.warn("News completely failed", error);
        }
}


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
            
            btn.textContent = toSentenceCase(term);
            
            btn.onclick = () => {
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