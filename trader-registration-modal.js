// trader-registration-modal.js
import { commodityData } from './data.js';
import { hideModal, showPage } from './ui-handlers.js';
import { saveNotification } from './utils.js';

let currentTraderRegData = { units: [] };
let traderRegCurrentStep = 1;

export function showTraderRegisterModal() {
    traderRegCurrentStep = 1;
    currentTraderRegData = { units: [] }; // Reset data for new registration
    document.getElementById('trader-reg-name').value = '';
    document.getElementById('trader-reg-market-select').value = 'select-market';
    document.getElementById('trader-reg-new-market-container').style.display = 'none';
    document.getElementById('trader-reg-new-market').value = '';
    document.getElementById('trader-reg-unit-list').innerHTML = ''; // Clear units
    showTraderRegisterStep(traderRegCurrentStep);
    document.getElementById("trader-register-modal").style.display = "flex";
    document.getElementById('overlay').classList.add('active');
}

export function showTraderRegisterStep(step) {
    const steps = document.querySelectorAll("#trader-register-modal .modal-step");
    steps.forEach((s, index) => {
        if (index + 1 === step) {
            s.style.display = "block";
        } else {
            s.style.display = "none";
        }
    });

    if (step === 1) {
        const marketSelect = document.getElementById('trader-reg-market-select');
        marketSelect.innerHTML = '<option value="select-market">Select Your Market</option><option value="new-market">Add New Market</option>';
        const markets = new Set();
        Object.values(commodityData).forEach(commodity => {
            commodity.traders.forEach(trader => {
                markets.add(trader.market);
            });
        });
        Array.from(markets).sort().forEach(market => {
            const option = document.createElement('option');
            option.value = market;
            option.textContent = market;
            marketSelect.appendChild(option);
        });
        // Add event listener for new market input
        document.getElementById('trader-reg-market-select').onchange = function() {
            const newMarketContainer = document.getElementById('trader-reg-new-market-container');
            if (this.value === 'new-market') {
                newMarketContainer.style.display = 'block';
            } else {
                newMarketContainer.style.display = 'none';
            }
        };
    } else if (step === 2) {
        const commoditySelect = document.getElementById("trader-reg-commodity-select");
        commoditySelect.innerHTML = '<option value="all">Select Commodity</option>';
        Object.keys(commodityData).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key.charAt(0).toUpperCase() + key.slice(1);
            commoditySelect.appendChild(option);
        });
    } else if (step === 3) {
        renderTraderRegUnits();
    } else if (step === 4) {
        document.getElementById('trader-reg-confirm-name').textContent = currentTraderRegData.name;
        document.getElementById('trader-reg-confirm-market').textContent = currentTraderRegData.market;
        document.getElementById('trader-reg-confirm-commodity').textContent = currentTraderRegData.commodity.charAt(0).toUpperCase() + currentTraderRegData.commodity.slice(1);
        const unitsList = document.getElementById('trader-reg-confirm-units');
        unitsList.innerHTML = '';
        if (currentTraderRegData.units.length === 0) {
            unitsList.innerHTML = '<li>No units added.</li>';
        } else {
            currentTraderRegData.units.forEach(unit => {
                const li = document.createElement('li');
                li.textContent = `${unit.name} (Weight: ${unit.weight} kg) - Ksh ${unit.price}`;
                unitsList.appendChild(li);
            });
        }
    } else if (step === 5) {
        // Message set in confirmTraderRegistration()
    }
}

export function nextTraderRegStep() {
    if (traderRegCurrentStep === 1) {
        const name = document.getElementById('trader-reg-name').value.trim();
        const marketSelect = document.getElementById('trader-reg-market-select').value;
        const newMarket = document.getElementById('trader-reg-new-market').value.trim();

        if (!name) { alert("Please enter your name."); return; }
        if (marketSelect === 'select-market') { alert("Please select your market or add a new one."); return; }
        if (marketSelect === 'new-market' && !newMarket) { alert("Please enter the new market name."); return; }

        currentTraderRegData.name = name;
        currentTraderRegData.market = marketSelect === 'new-market' ? newMarket : marketSelect;

    } else if (traderRegCurrentStep === 2) {
        const commodity = document.getElementById("trader-reg-commodity-select").value;
        if (commodity === 'all') { alert("Please select a commodity."); return; }
        currentTraderRegData.commodity = commodity;
    } else if (traderRegCurrentStep === 3) {
        if (currentTraderRegData.units.length === 0) { alert("Please add at least one unit and its price/weight."); return; }
    }

    if (traderRegCurrentStep < 5) {
        traderRegCurrentStep++;
        showTraderRegisterStep(traderRegCurrentStep);
    }
}

export function prevTraderRegStep() {
    if (traderRegCurrentStep > 1) {
        traderRegCurrentStep--;
        showTraderRegisterStep(traderRegCurrentStep);
    }
}

export function addTraderRegUnit() {
    const unitName = document.getElementById('trader-reg-unit-name').value.trim();
    const unitPrice = parseFloat(document.getElementById('trader-reg-unit-price').value);
    const unitWeight = parseFloat(document.getElementById('trader-reg-unit-weight').value);

    if (!unitName || isNaN(unitPrice) || isNaN(unitWeight) || unitPrice <= 0 || unitWeight <= 0) {
        alert("Please enter a valid unit name, price, and weight.");
        return;
    }

    currentTraderRegData.units.push({
        name: unitName,
        price: unitPrice,
        weight: unitWeight
    });

    document.getElementById('trader-reg-unit-name').value = '';
    document.getElementById('trader-reg-unit-price').value = '';
    document.getElementById('trader-reg-unit-weight').value = '';
    renderTraderRegUnits();
}

export function removeTraderRegUnit(index) {
    currentTraderRegData.units.splice(index, 1);
    renderTraderRegUnits();
}

function renderTraderRegUnits() {
    const unitListDiv = document.getElementById('trader-reg-unit-list');
    unitListDiv.innerHTML = '';
    currentTraderRegData.units.forEach((unit, index) => {
        const div = document.createElement('div');
        div.className = 'trader-reg-unit-entry';
        div.innerHTML = `
            <p><strong>Unit:</strong> ${unit.name}</p>
            <p><strong>Price:</strong> Ksh ${unit.price}</p>
            <p><strong>Weight:</strong> ${unit.weight} kg</p>
            <button onclick="window.removeTraderRegUnit(${index})">Remove</button>
        `;
        unitListDiv.appendChild(div);
    });
}

export function confirmTraderRegistration() {
    console.log("Trader Registration Data:", currentTraderRegData);

    let registeredTraders = JSON.parse(localStorage.getItem('registeredTraders')) || [];
    registeredTraders.push(currentTraderRegData);
    localStorage.setItem('registeredTraders', JSON.stringify(registeredTraders));

    saveNotification(`Trader registration for ${currentTraderRegData.name} selling ${currentTraderRegData.commodity} at ${currentTraderRegData.market} is complete.`);

    document.getElementById("trader-reg-placed-message").textContent = `Thank you, ${currentTraderRegData.name}! Your registration for ${currentTraderRegData.commodity} in ${currentTraderRegData.market} is complete.`;

    traderRegCurrentStep = 5;
    showTraderRegisterStep(traderRegCurrentStep);

    setTimeout(() => {
        closeTraderRegisterModal();
        showPage('home-content');
    }, 1500);
}

export function closeTraderRegisterModal() {
    document.getElementById("trader-register-modal").style.display = "none";
    hideModal('trader-register-modal');
    traderRegCurrentStep = 1;
    currentTraderRegData = { units: [] };
}

// Global window functions for HTML onclick
window.showTraderRegisterModal = showTraderRegisterModal;
window.nextTraderRegStep = nextTraderRegStep;
window.prevTraderRegStep = prevTraderRegStep;
window.addTraderRegUnit = addTraderRegUnit;
window.removeTraderRegUnit = removeTraderRegUnit;
window.confirmTraderRegistration = confirmTraderRegistration;
window.closeTraderRegisterModal = closeTraderRegisterModal;

