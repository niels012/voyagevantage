// js/modules/ui.js
import { getStaticMapURL } from './map.js';

// Selectors
const elements = {
    dashboard: document.getElementById('dashboard'),
    loading: document.getElementById('loading'),
    error: document.getElementById('error-message'),
    mapImg: document.getElementById('map-img'),
    // Context
    countryName: document.getElementById('country-name'),
    flag: document.getElementById('flag-container'),
    capital: document.getElementById('capital'),
    population: document.getElementById('population'),
    language: document.getElementById('language'),
    timezone: document.getElementById('timezone'),
    // Budget
    rate: document.getElementById('exchange-rate'),
    code: document.getElementById('currency-code'),
    convertInput: document.getElementById('amount'),
    convertResult: document.getElementById('conversion-result'),
    // News
    newsList: document.getElementById('news-list'),
};

let currentRate = 0;

export function showLoading() {
    elements.loading.classList.remove('hidden');
    elements.dashboard.classList.add('hidden');
    elements.error.classList.add('hidden');
}

export function hideLoading() {
    elements.loading.classList.add('hidden');
}

export function showError(message) {
    elements.loading.classList.add('hidden');
    elements.error.textContent = message;
    elements.error.classList.remove('hidden');
}

export function renderDashboard(countryData, newsData, currencyData) {
    elements.dashboard.classList.remove('hidden');
    
    // --- 1. Render Context ---
    const country = countryData[0];
    elements.countryName.textContent = country.name.common;
    elements.flag.innerHTML = `<img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="100">`;
    elements.capital.textContent = country.capital ? country.capital[0] : 'N/A';
    elements.population.textContent = country.population.toLocaleString();
    
    const langs = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
    elements.language.textContent = langs;
    elements.timezone.textContent = country.timezones[0];

    // --- 2. Render Map ---
    const [lat, lng] = country.latlng;
    // Generate the static map URL
    const mapUrl = getStaticMapURL(lat, lng);
    
    // Set the image source
    elements.mapImg.src = mapUrl;
    elements.mapImg.alt = `Map of ${country.name.common}`;
    // --- 3. Render Budget ---
    // Get currency code (e.g., "JPY")
    const currencyCode = Object.keys(country.currencies)[0];
    
    if (currencyData && currencyData.rates && currencyData.rates[currencyCode]) {
        currentRate = currencyData.rates[currencyCode];
        elements.rate.textContent = currentRate.toFixed(2);
        elements.code.textContent = currencyCode;
        updateConversion(); // Initial calculation
    } else {
        elements.rate.textContent = "Unavailable";
    }

    // --- 4. Render News ---
    elements.newsList.innerHTML = '';
    if (newsData.articles && newsData.articles.length > 0) {
        newsData.articles.forEach(article => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="${article.url}" target="_blank">${article.title}</a>
                <p><small>${new Date(article.publishedAt).toLocaleDateString()}</small></p>
            `;
            elements.newsList.appendChild(li);
        });
    } else {
        elements.newsList.innerHTML = '<li>No recent news found.</li>';
    }
}

// Helper for currency conversion
export function updateConversion() {
    const amount = parseFloat(elements.convertInput.value);
    if (!isNaN(amount) && currentRate > 0) {
        const result = (amount * currentRate).toFixed(2);
        elements.convertResult.textContent = `${result} ${elements.code.textContent}`;
    }
}

// Event listener for live conversion
elements.convertInput.addEventListener('input', updateConversion);