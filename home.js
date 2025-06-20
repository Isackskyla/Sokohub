// home.js
import { commodityData, priceOptions } from './data.js';
import { showTrader } from './trader-modal.js'; // Import showTrader from its module
const commoditiesContainer = document.getElementById('commodities-container');
const searchInput = document.getElementById('searchInput');
const commoditySelect = document.getElementById('commoditySelect');
const marketSelect = document.getElementById('marketSelect');
const priceSelect = document.getElementById('priceSelect');

let currentCommodityView = null; // State for single commodity view

export function renderAllCommoditySections() {
  commoditiesContainer.innerHTML = '';
  for (const [key, value] of Object.entries(commodityData)) {
    const section = document.createElement('div');
    section.className = 'commodity-section';
    section.id = `section-${key}`;
    const title = document.createElement('h2');
    title.textContent = `${value.emoji} ${key.charAt(0).toUpperCase() + key.slice(1)}`;
    title.dataset.commodityKey = key;
    title.onclick = () => showSingleCommodityView(key);
    const cardContainer = document.createElement('div');
    cardContainer.className = 'commodity-row'; // Default to row layout

    value.traders.forEach(trader => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.id = trader.id;
      card.dataset.name = trader.name.toLowerCase();
      card.dataset.market = trader.market.toLowerCase();
      card.dataset.commodity = key;
      card.dataset.units = trader.units;
      card.dataset.price = trader.price;
      card.onclick = (e) => {
        e.stopPropagation();
        showTrader(card); // Use the imported showTrader
      };

      const priceData = JSON.parse(trader.price);
      const firstPriceKey = Object.keys(priceData)[0];
      const firstPrice = firstPriceKey ? priceData[firstPriceKey] : 'N/A'; // Handle cases with no price
      const firstPriceUnitDisplay = firstPriceKey ? ` (${firstPriceKey})` : '';

      card.innerHTML = `
        <h3>${trader.name}</h3>
        <p>Market: ${trader.market}</p>
        <p>${key.charAt(0).toUpperCase() + key.slice(1)} - From Ksh ${firstPrice}${firstPriceUnitDisplay}</p>
      `;
      cardContainer.appendChild(card);
    });
    section.appendChild(title);
    section.appendChild(cardContainer);
    commoditiesContainer.appendChild(section);
  }
}

export function showSingleCommodityView(commodityKey) {
  currentCommodityView = commodityKey;
  document.getElementById('filter-container').style.display = 'none';
  document.getElementById('back-button').style.display = 'block';
  history.pushState({
    page: 'home-content',
    commodity: commodityKey
  }, '', `#${commodityKey}`);

  document.querySelectorAll('.commodity-section').forEach(sec => {
    if (sec.id !== `section-${commodityKey}`) {
      sec.style.display = 'none';
    } else {
      sec.style.display = 'block';
      const cardContainer = sec.querySelector('.commodity-row, .commodity-grid');
      if (cardContainer) {
        cardContainer.classList.remove('commodity-row');
        cardContainer.classList.add('commodity-grid');
      }
    }
  });
}

export function showAllCommoditiesView() {
  currentCommodityView = null;
  document.getElementById('filter-container').style.display = 'block';
  document.getElementById('back-button').style.display = 'none';
  history.pushState({
    page: 'home-content'
  }, '', `#home`);

  document.querySelectorAll('.commodity-section').forEach(sec => {
    sec.style.display = 'block';
    const cardContainer = sec.querySelector('.commodity-grid, .commodity-row');
    if (cardContainer) {
      cardContainer.classList.remove('commodity-grid');
      cardContainer.classList.add('commodity-row');
    }
  });
  applyFilters();
}

export function applyFilters() {
  const query = searchInput.value.toLowerCase();
  const selectedCommodity = commoditySelect.value;
  const selectedMarket = marketSelect.value;
  const selectedPrice = priceSelect.value;

  // Only apply filters if on the home content and not in a single commodity view
  if (document.getElementById('home-content').style.display === 'block' && currentCommodityView === null) {
    document.querySelectorAll('.commodity-section').forEach(section => {
      let visibleCardsInSection = 0;
      const cards = section.querySelectorAll('.card');
      const sectionCommodityKey = section.id.replace('section-', '');

      cards.forEach(card => {
        const nameMatch = card.dataset.name.includes(query);
        const marketMatch = selectedMarket === 'all' || card.dataset.market.includes(selectedMarket);
        const commodityMatch = selectedCommodity === 'all' || sectionCommodityKey === selectedCommodity;
        const priceMatch = checkPrice(card, selectedPrice, sectionCommodityKey);

        if (nameMatch && marketMatch && commodityMatch && priceMatch) {
          card.style.display = 'block';
          visibleCardsInSection++;
        } else {
          card.style.display = 'none';
        }
      });
      section.style.display = visibleCardsInSection > 0 ? 'block' : 'none';
    });
  }
}

function checkPrice(card, range, commodityKey) {
  if (range === 'all') return true;

  const priceData = JSON.parse(card.dataset.price);
  const prices = Object.values(priceData);
  const minPrice = prices.length > 0 ? Math.min(...prices) : Infinity; // Handle no prices case

  if (priceOptions[commodityKey]) {
    const priceRange = priceOptions[commodityKey].find(opt => opt === range);
    if (priceRange) {
      if (priceRange.startsWith('Below ')) {
        return minPrice < parseInt(priceRange.replace('Below ', ''));
      } else if (priceRange.endsWith('+')) {
        return minPrice >= parseInt(priceRange.replace('+', ''));
      } else if (priceRange.includes('-')) {
        const [min, max] = priceRange.split('-').map(p => parseInt(p));
        return minPrice >= min && minPrice <= max;
      }
    }
  }
  return true;
}


export function populateFilters() {
  commoditySelect.innerHTML = '<option value="all">All Commodities</option>';
  const markets = new Set();
  Object.keys(commodityData).forEach(key => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = key.charAt(0).toUpperCase() + key.slice(1);
    commoditySelect.appendChild(option);

    commodityData[key].traders.forEach(trader => {
      markets.add(trader.market.toLowerCase());
    });
  });

  marketSelect.innerHTML = '<option value="all">All Markets</option>';
  Array.from(markets).sort().forEach(market => {
    const option = document.createElement('option');
    option.value = market;
    option.textContent = market.charAt(0).toUpperCase() + market.slice(1);
    marketSelect.appendChild(option);
  });

  updatePriceOptions(commoditySelect.value);
}

export function updatePriceOptions(selectedCommodity) {
  priceSelect.innerHTML = '<option value="all">Any Price</option>';
  if (selectedCommodity !== 'all' && priceOptions[selectedCommodity]) {
    priceOptions[selectedCommodity].forEach(optionText => {
      const option = document.createElement('option');
      option.value = optionText;
      option.textContent = optionText;
      priceSelect.appendChild(option);
    });
  }
}

