// trader-modal.js
import { generateOrderId, saveOrder, saveNotification, getReadableCountyName, getCountyFromMarket, animateChange } from './utils.js';
import { hideModal, showPage } from './ui-handlers.js';
import { kenyanCountiesAndTowns, baseDeliveryRates } from './data.js';
import { populateCounties, populateTowns, populateSpecificPlaces } from './location-selectors.js'; // <--- ADD THIS LINE

let currentTraderData = {};
let currentStep = 1;

export function showTrader(card) {
  currentTraderData = {
    id: card.dataset.id,
    name: card.dataset.name,
    market: card.dataset.market,
    commodity: card.dataset.commodity,
    units: JSON.parse(card.dataset.units),
    price: JSON.parse(card.dataset.price)
  };

  document.getElementById("modal-title").textContent = currentTraderData.name;
  document.getElementById("modal-market").textContent = currentTraderData.market;
  document.getElementById("modal-commodity").textContent = currentTraderData.commodity;

  currentStep = 1;
  showTraderStep(currentStep);
  document.getElementById("trader-modal").style.display = "flex";
  document.getElementById('overlay').classList.add('active');
}

export function showTraderStep(step) {
  const steps = document.querySelectorAll("#trader-modal .modal-step");
  steps.forEach((s, index) => {
    if (index + 1 === step) {
      s.style.display = "block";
    } else {
      s.style.display = "none";
    }
  });

  if (step === 2) {
    const unitSelect = document.getElementById("unit-select");
    unitSelect.innerHTML = "";
    for (let unit in currentTraderData.units) {
      let opt = document.createElement("option");
      opt.value = unit;
      opt.textContent = `${unit} - Ksh ${currentTraderData.price[unit]}`;
      unitSelect.appendChild(opt);
    }
    document.getElementById("quantity").value = 1;
    updateTraderModal();
  } else if (step === 3) {
    populateCounties("buyerCountySelect");
    populateTowns("buyerCountySelect", "destinationTownSelect", "destinationPlaceSelect");

    // Add event listeners for dynamic updates
    document.getElementById("buyerCountySelect").onchange = () => {
        populateTowns("buyerCountySelect", "destinationTownSelect", "destinationPlaceSelect");
        updateTraderModal();
    };
    document.getElementById("destinationTownSelect").onchange = () => {
        populateSpecificPlaces("buyerCountySelect", "destinationTownSelect", "destinationPlaceSelect");
        updateTraderModal();
    };
    document.getElementById("destinationPlaceSelect").onchange = updateTraderModal;

    updateTraderModal();
  } else if (step === 4) {
    const selectedUnit = document.getElementById("unit-select").value;
    const selectedQty = parseInt(document.getElementById("quantity").value);
    const selectedBuyerCounty = document.getElementById("buyerCountySelect").value;
    const selectedDestinationTown = document.getElementById("destinationTownSelect").value;
    const selectedDestinationPlace = document.getElementById("destinationPlaceSelect").value;

    document.getElementById("confirm-trader").textContent = currentTraderData.name;
    document.getElementById("confirm-market").textContent = currentTraderData.market;
    document.getElementById("confirm-commodity").textContent = currentTraderData.commodity;
    document.getElementById("confirm-unit-qty").textContent = `${selectedQty} x ${selectedUnit} (Ksh ${currentTraderData.price[selectedUnit]} each)`;

    let fullDestinationText = "Not Selected";
    if (selectedBuyerCounty !== 'all') {
        fullDestinationText = getReadableCountyName(selectedBuyerCounty);
        if (selectedDestinationTown !== 'all') {
            fullDestinationText += ` - ${selectedDestinationTown.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`;
            if (selectedDestinationPlace !== 'all') {
                fullDestinationText += ` (${selectedDestinationPlace})`;
            }
        }
    }

    document.getElementById("confirm-delivery-destination").textContent = fullDestinationText;
    document.getElementById("confirm-delivery-method-display-container").style.display = 'none';
    updateTraderModal();
  } else if (step === 5) {
    // Message updated in confirmOrder()
  }
}

export function nextTraderStep() {
  if (currentStep === 2) {
      const unit = document.getElementById("unit-select").value;
      const qty = parseInt(document.getElementById("quantity").value);
      if (!unit || qty < 1) {
          alert("Please select a valid unit and quantity.");
          return;
      }
  } else if (currentStep === 3) {
      const selectedBuyerCounty = document.getElementById("buyerCountySelect").value;
      const selectedDestinationTown = document.getElementById("destinationTownSelect").value;

      if (selectedBuyerCounty === 'all') {
          alert("Please select your county for delivery.");
          return;
      }
      if (selectedDestinationTown === 'all') {
          alert("Please select a delivery town.");
          return;
      }
  }

  if (currentStep < 5) {
    currentStep++;
    showTraderStep(currentStep);
  }
}

export function prevTraderStep() {
  if (currentStep > 1) {
    currentStep--;
    showTraderStep(currentStep);
  }
}

export function changeTraderQty(amount) {
  const qtyInput = document.getElementById("quantity");
  let qty = parseInt(qtyInput.value);
  qty = Math.max(1, qty + amount);
  qtyInput.value = qty;
  updateTraderModal();
}

export function closeTraderModal() {
  document.getElementById("trader-modal").style.display = "none";
  hideModal('trader-modal');
  currentTraderData = {};
  currentStep = 1;
}

export function updateTraderModal() {
  const unit = document.getElementById("unit-select").value;
  const qty = parseInt(document.getElementById("quantity").value);
  const pricePerUnit = currentTraderData.price[unit];
  let calculatedSubtotal = pricePerUnit * qty;
  const unitWeight = currentTraderData.units[unit];
  const weight = isNaN(unitWeight) ? 0 : unitWeight * qty;

  const priceEl = document.getElementById("price-per-unit-display");
  const subtotalEl = document.getElementById("subtotal-display");
  priceEl.textContent = `Ksh ${pricePerUnit.toFixed(2)}`;
  subtotalEl.textContent = `Ksh ${calculatedSubtotal.toFixed(2)}`;
  animateChange("price-per-unit-display");
  animateChange("subtotal-display");

  const selectedBuyerCounty = document.getElementById("buyerCountySelect").value;
  const traderMarketCounty = getCountyFromMarket(currentTraderData.market);
  let deliveryFee = 0;

  if (selectedBuyerCounty !== 'all') {
      if (selectedBuyerCounty.toLowerCase() === traderMarketCounty) {
          deliveryFee = baseDeliveryRates.local;
      } else {
          deliveryFee = baseDeliveryRates.regional;
      }
      if (weight > 100) {
          deliveryFee += 200;
      } else if (weight > 50) {
          deliveryFee += 100;
      }
  }

  const total = calculatedSubtotal + deliveryFee;

  const feeEl = document.getElementById("delivery-fee-display");
  const deliverySubtotalEl = document.getElementById("delivery-subtotal-display");
  const deliveryTotalEl = document.getElementById("delivery-total-display");

  deliverySubtotalEl.textContent = `Ksh ${calculatedSubtotal.toFixed(2)}`;
  feeEl.textContent = `Ksh ${deliveryFee.toFixed(2)}`;
  deliveryTotalEl.textContent = `Ksh ${total.toFixed(2)}`;

  animateChange("delivery-subtotal-display");
  animateChange("delivery-fee-display");
  animateChange("delivery-total-display");

  document.getElementById("confirm-weight").textContent = `${weight.toFixed(1)} kg`;
  document.getElementById("confirm-delivery-fee").textContent = deliveryFee.toFixed(2);
  document.getElementById("confirm-total-cost").textContent = total.toFixed(2);
  document.getElementById("confirm-unit-qty").textContent = `${qty} x ${unit} (Ksh ${pricePerUnit.toFixed(2)} each)`;

  const confirmSelectedBuyerCounty = document.getElementById("buyerCountySelect").value;
  const confirmSelectedDestinationTown = document.getElementById("destinationTownSelect").value;
  const confirmSelectedDestinationPlace = document.getElementById("destinationPlaceSelect").value;

  let confirmDestinationText = "Not Selected";
  if (confirmSelectedBuyerCounty !== 'all') {
      confirmDestinationText = getReadableCountyName(confirmSelectedBuyerCounty);
      if (confirmSelectedDestinationTown !== 'all') {
          confirmDestinationText += ` - ${confirmSelectedDestinationTown}`;
          if (confirmSelectedDestinationPlace !== 'all') {
              confirmDestinationText += ` (${confirmSelectedDestinationPlace})`;
          }
      }
  }
  document.getElementById("confirm-delivery-destination").textContent = confirmDestinationText;
}

export function confirmOrder() {
  const orderId = generateOrderId();
  const selectedUnit = document.getElementById("unit-select").value;
  const selectedQty = parseInt(document.getElementById("quantity").value);
  const pricePerUnit = currentTraderData.price[selectedUnit];
  const unitWeight = currentTraderData.units[selectedUnit];
  const weight = isNaN(unitWeight) ? 0 : unitWeight * selectedQty;

  const orderDetails = {
    orderId: orderId,
    type: "individual",
    trader: currentTraderData.name,
    market: currentTraderData.market,
    commodity: currentTraderData.commodity,
    unit: selectedUnit,
    quantity: selectedQty,
    pricePerUnit: pricePerUnit,
    weight: weight,
    buyerCounty: document.getElementById("buyerCountySelect").value,
    deliveryDestinationTown: document.getElementById("destinationTownSelect").value,
    deliveryDestinationPlace: document.getElementById("destinationPlaceSelect").value,
    deliveryFee: parseFloat(document.getElementById("confirm-delivery-fee").textContent),
    totalCost: parseFloat(document.getElementById("confirm-total-cost").textContent),
    timestamp: new Date().toLocaleString()
  };
  saveOrder(orderDetails);
  saveNotification(`Your order number ${orderId} for ${orderDetails.commodity} from ${orderDetails.trader} has been placed. You will receive a message to pick your order from ${orderDetails.deliveryDestinationPlace || orderDetails.deliveryDestinationTown}.`);

  document.getElementById("order-placed-message").textContent = `Your order for ${currentTraderData.commodity} from ${currentTraderData.name} has been placed! Your order number is: ${orderId}. You will receive a message to pick your order from ${orderDetails.deliveryDestinationPlace || orderDetails.deliveryDestinationTown}.`;

  currentStep = 5;
  showTraderStep(currentStep);

  setTimeout(() => {
      showPage('orders-content');
      closeTraderModal();
  }, 1500);
}

// Global window functions for HTML onclick
window.showTrader = showTrader;
window.nextStep = nextTraderStep;
window.prevStep = prevTraderStep;
window.changeQty = changeTraderQty;
window.closeTraderModal = closeTraderModal;
window.confirmOrder = confirmOrder;
window.clearOrder = closeTraderModal; // Renamed for clarity

