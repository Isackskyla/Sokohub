// bulk-order-modal.js
import { generateOrderId, saveOrder, saveNotification, getReadableCountyName, animateChange } from './utils.js';
import { hideModal, showPage } from './ui-handlers.js';
import { commodityData, kenyanCountiesAndTowns, baseDeliveryRates } from './data.js';
import { populateCounties, populateTowns, populateSpecificPlaces } from './location-selectors.js'; // Import from new module

let currentBulkOrderData = {};
let bulkOrderCurrentStep = 1;

export function showBulkOrderModal() {
    bulkOrderCurrentStep = 1;
    currentBulkOrderData = {}; // Reset data for new bulk order
    showBulkOrderStep(bulkOrderCurrentStep);
    document.getElementById("bulk-order-modal").style.display = "flex";
    document.getElementById('overlay').classList.add('active');
}

export function showBulkOrderStep(step) {
    const steps = document.querySelectorAll("#bulk-order-modal .modal-step");
    steps.forEach((s, index) => {
        if (index + 1 === step) {
            s.style.display = "block";
        } else {
            s.style.display = "none";
        }
    });

    if (step === 1) {
        const commoditySelect = document.getElementById("bulk-commodity-select");
        commoditySelect.innerHTML = '<option value="all">Select Commodity</option>';
        Object.keys(commodityData).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key.charAt(0).toUpperCase() + key.slice(1);
            commoditySelect.appendChild(option);
        });
    } else if (step === 2) {
        const selectedCommodity = document.getElementById("bulk-commodity-select").value;
        if (selectedCommodity === 'all') {
            alert("Please select a commodity first.");
            bulkOrderCurrentStep = 1;
            showBulkOrderStep(1);
            return;
        }

        const unitSelect = document.getElementById("bulk-unit-select");
        unitSelect.innerHTML = "";
        currentBulkOrderData.commodity = selectedCommodity;

        let unitsMap = {};
        commodityData[selectedCommodity].traders.forEach(trader => {
            const traderUnits = JSON.parse(trader.units);
            const traderPrices = JSON.parse(trader.price);
            for (const unitName in traderUnits) {
                if (!unitsMap[unitName]) {
                    unitsMap[unitName] = { totalWeight: 0, totalPrice: 0, count: 0 };
                }
                unitsMap[unitName].totalWeight += traderUnits[unitName];
                unitsMap[unitName].totalPrice += traderPrices[unitName];
                unitsMap[unitName].count++;
            }
        });

        for (const unitName in unitsMap) {
            const avgPrice = unitsMap[unitName].totalPrice / unitsMap[unitName].count;
            const avgWeight = unitsMap[unitName].totalWeight / unitsMap[unitName].count;
            let opt = document.createElement("option");
            opt.value = unitName;
            opt.textContent = `${unitName} (Avg. Ksh ${avgPrice.toFixed(2)})`;
            unitSelect.appendChild(opt);

            if (!currentBulkOrderData.unitAverages) {
                currentBulkOrderData.unitAverages = {};
            }
            currentBulkOrderData.unitAverages[unitName] = { price: avgPrice, weight: avgWeight };
        }
        document.getElementById("bulk-quantity").value = 1;
        updateBulkOrderModal();
    } else if (step === 3) {
        populateCounties("buyerCountySelectBulk");
        populateTowns("buyerCountySelectBulk", "destinationTownSelectBulk", "destinationPlaceSelectBulk");

        document.getElementById("buyerCountySelectBulk").onchange = () => {
            populateTowns("buyerCountySelectBulk", "destinationTownSelectBulk", "destinationPlaceSelectBulk");
            updateBulkOrderModal();
        };
        document.getElementById("destinationTownSelectBulk").onchange = () => {
            populateSpecificPlaces("buyerCountySelectBulk", "destinationTownSelectBulk", "destinationPlaceSelectBulk");
            updateBulkOrderModal();
        };
        document.getElementById("destinationPlaceSelectBulk").onchange = updateBulkOrderModal;

        updateBulkOrderModal();
    } else if (step === 4) {
        const selectedCommodity = document.getElementById("bulk-commodity-select").value;
        const selectedUnit = document.getElementById("bulk-unit-select").value;
        const selectedQty = parseInt(document.getElementById("bulk-quantity").value);
        const selectedBuyerCounty = document.getElementById("buyerCountySelectBulk").value;
        const selectedDestinationTown = document.getElementById("destinationTownSelectBulk").value;
        const selectedDestinationPlace = document.getElementById("destinationPlaceSelectBulk").value;

        document.getElementById("bulk-confirm-commodity").textContent = selectedCommodity.charAt(0).toUpperCase() + selectedCommodity.slice(1);
        document.getElementById("bulk-confirm-unit-qty").textContent = `${selectedQty} x ${selectedUnit}`;

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
        document.getElementById("bulk-confirm-delivery-destination").textContent = fullDestinationText;
        document.getElementById("bulk-confirm-delivery-method-display-container").style.display = 'none';

        updateBulkOrderModal();
    } else if (step === 5) {
        // Message updated in confirmBulkOrder()
    }
}

export function nextBulkOrderStep() {
    if (bulkOrderCurrentStep === 1) {
        if (document.getElementById("bulk-commodity-select").value === 'all') {
            alert("Please select a commodity.");
            return;
        }
    } else if (bulkOrderCurrentStep === 2) {
         const unit = document.getElementById("bulk-unit-select").value;
         const qty = parseInt(document.getElementById("bulk-quantity").value);
         if (!unit || qty < 1) {
             alert("Please select a valid unit and quantity.");
             return;
         }
    } else if (bulkOrderCurrentStep === 3) {
        const selectedBuyerCounty = document.getElementById("buyerCountySelectBulk").value;
        const selectedDestinationTown = document.getElementById("destinationTownSelectBulk").value;

        if (selectedBuyerCounty === 'all') {
            alert("Please select your county for delivery.");
            return;
        }
        if (selectedDestinationTown === 'all') {
            alert("Please select a delivery town.");
            return;
        }
    }

    if (bulkOrderCurrentStep < 5) {
        bulkOrderCurrentStep++;
        showBulkOrderStep(bulkOrderCurrentStep);
    }
}

export function prevBulkOrderStep() {
    if (bulkOrderCurrentStep > 1) {
        bulkOrderCurrentStep--;
        showBulkOrderStep(bulkOrderCurrentStep);
    }
}

export function changeBulkQty(amount) {
    const qtyInput = document.getElementById("bulk-quantity");
    let qty = parseInt(qtyInput.value);
    qty = Math.max(1, qty + amount);
    qtyInput.value = qty;
    updateBulkOrderModal();
}

export function updateBulkOrderModal() {
    const unit = document.getElementById("bulk-unit-select").value;
    const qty = parseInt(document.getElementById("bulk-quantity").value);

    if (!currentBulkOrderData.unitAverages || !currentBulkOrderData.unitAverages[unit]) {
        console.warn("Unit average data not found for bulk order or unit not selected.");
        document.getElementById("bulk-price-per-unit-display").textContent = `Ksh 0.00`;
        document.getElementById("bulk-subtotal-display").textContent = `Ksh 0.00`;
        document.getElementById("bulk-delivery-subtotal-display").textContent = `Ksh 0.00`;
        document.getElementById("bulk-delivery-fee-display").textContent = `Ksh 0.00`;
        document.getElementById("bulk-delivery-total-display").textContent = `Ksh 0.00`;
        document.getElementById("bulk-confirm-weight").textContent = `0.0 kg`;
        document.getElementById("bulk-confirm-delivery-fee").textContent = `0.00`;
        document.getElementById("bulk-confirm-total-cost").textContent = `0.00`;
        return;
    }

    const pricePerUnit = currentBulkOrderData.unitAverages[unit].price;
    const unitWeight = currentBulkOrderData.unitAverages[unit].weight;

    let calculatedSubtotal = pricePerUnit * qty;
    const weight = isNaN(unitWeight) ? 0 : unitWeight * qty;

    document.getElementById("bulk-price-per-unit-display").textContent = `Ksh ${pricePerUnit.toFixed(2)}`;
    document.getElementById("bulk-subtotal-display").textContent = `Ksh ${calculatedSubtotal.toFixed(2)}`;
    animateChange("bulk-price-per-unit-display");
    animateChange("bulk-subtotal-display");

    const selectedBuyerCounty = document.getElementById("buyerCountySelectBulk").value;
    let deliveryFee = 0;

    if (selectedBuyerCounty !== 'all') {
        deliveryFee = baseDeliveryRates.regional;
        if (weight > 100) {
            deliveryFee += 200;
        } else if (weight > 50) {
            deliveryFee += 100;
        }
    }

    const total = calculatedSubtotal + deliveryFee;

    document.getElementById("bulk-delivery-subtotal-display").textContent = `Ksh ${calculatedSubtotal.toFixed(2)}`;
    document.getElementById("bulk-delivery-fee-display").textContent = `Ksh ${deliveryFee.toFixed(2)}`;
    document.getElementById("bulk-delivery-total-display").textContent = `Ksh ${total.toFixed(2)}`;
    animateChange("bulk-delivery-subtotal-display");
    animateChange("bulk-delivery-fee-display");
    animateChange("bulk-delivery-total-display");

    document.getElementById("bulk-confirm-weight").textContent = `${weight.toFixed(1)} kg`;
    document.getElementById("bulk-confirm-delivery-fee").textContent = deliveryFee.toFixed(2);
    document.getElementById("bulk-confirm-total-cost").textContent = total.toFixed(2);
}

export function closeBulkOrderModal() {
    document.getElementById("bulk-order-modal").style.display = "none";
    hideModal('bulk-order-modal');
    currentBulkOrderData = {};
    bulkOrderCurrentStep = 1;
}

export function confirmBulkOrder() {
  const orderId = generateOrderId();
  const selectedUnit = document.getElementById("bulk-unit-select").value;
  const selectedQty = parseInt(document.getElementById("bulk-quantity").value);
  const pricePerUnit = currentBulkOrderData.unitAverages[selectedUnit].price;
  const unitWeight = currentBulkOrderData.unitAverages[selectedUnit].weight;
  const weight = isNaN(unitWeight) ? 0 : unitWeight * selectedQty;

  const orderDetails = {
    orderId: orderId,
    type: "bulk",
    commodity: document.getElementById("bulk-commodity-select").value,
    unit: selectedUnit,
    quantity: selectedQty,
    pricePerUnit: pricePerUnit,
    weight: weight,
    buyerCounty: document.getElementById("buyerCountySelectBulk").value,
    deliveryDestinationTown: document.getElementById("destinationTownSelectBulk").value,
    deliveryDestinationPlace: document.getElementById("destinationPlaceSelectBulk").value,
    deliveryFee: parseFloat(document.getElementById("bulk-confirm-delivery-fee").textContent),
    totalCost: parseFloat(document.getElementById("bulk-confirm-total-cost").textContent),
    timestamp: new Date().toLocaleString()
  };
  saveOrder(orderDetails);
  saveNotification(`Your bulk order number ${orderId} for ${orderDetails.quantity} x ${orderDetails.unit} of ${orderDetails.commodity} has been placed. You will receive a message to pick your order from ${orderDetails.deliveryDestinationPlace || orderDetails.deliveryDestinationTown}.`);

  document.getElementById("bulk-order-placed-message").textContent = `Your bulk order for ${orderDetails.commodity} has been placed! Your order number is: ${orderId}. You will receive a message to pick your order from ${orderDetails.deliveryDestinationPlace || orderDetails.deliveryDestinationTown}.`;

  bulkOrderCurrentStep = 5;
  showBulkOrderStep(bulkOrderCurrentStep);

  setTimeout(() => {
      showPage('orders-content');
      closeBulkOrderModal();
  }, 1500);
}

// Global window functions for HTML onclick
window.showBulkOrderModal = showBulkOrderModal;
window.nextBulkOrderStep = nextBulkOrderStep;
window.prevBulkOrderStep = prevBulkOrderStep;
window.changeBulkQty = changeBulkQty;
window.closeBulkOrderModal = closeBulkOrderModal;
window.confirmBulkOrder = confirmBulkOrder;

